// FFmpeg service for video processing
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export const initializeFFmpeg = async () => {
  const ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
  });

  return ffmpeg;
};

export const processVideo = async (ffmpeg: FFmpeg, storyboard: any[], mediaAssets: any[]) => {
  const inputFiles: string[] = [];
  const filterComplexParts: string[] = [];
  const concatInputs: string[] = [];

  for (let i = 0; i < storyboard.length; i++) {
    const item = storyboard[i];
    const asset = mediaAssets.find(a => a.id === item.assetId);
    if (!asset) continue;

    const imageFileName = `img${i}.png`;
    await ffmpeg.writeFile(imageFileName, await fetchFile(asset.src));
    inputFiles.push('-i', imageFileName);

    filterComplexParts.push(`[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=25,trim=duration=${item.duration}[v${i}];`);

    if (item.audioSrc) {
      const audioFileName = `audio${i}.wav`;
      await ffmpeg.writeFile(audioFileName, await fetchFile(item.audioSrc));
      inputFiles.push('-i', audioFileName);
      concatInputs.push(`[v${i}][${storyboard.length + inputFiles.filter(f => f.startsWith('audio')).length - 1}:a]`);
    } else {
      concatInputs.push(`[v${i}][anull${i}]`);
      filterComplexParts.push(`anullsrc=channel_layout=stereo:sample_rate=44100[anull${i}];`);
    }
  }

  const filterComplexCommand = filterComplexParts.join('') + concatInputs.join('') + `concat=n=${storyboard.length}:v=1:a=1[outv][outa]`;

  const commandArgs = [
    ...inputFiles,
    '-filter_complex', filterComplexCommand,
    '-map', '[outv]',
    '-map', '[outa]',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    'output.mp4'
  ];

  await ffmpeg.exec(commandArgs);

  const data = await ffmpeg.readFile('output.mp4');
  return new Blob([data], { type: 'video/mp4' });
};
