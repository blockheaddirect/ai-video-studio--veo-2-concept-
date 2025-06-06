
import React from 'react';
import { FilterOption } from './types';

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
    <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .897 1.203A5.243 5.243 0 0 0 5.26 17.242Z" />
  </svg>
);

export const FilmIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm-1.5 3a1.5 1.5 0 0 1 1.5-1.5h1.5v12H3A1.5 1.5 0 0 1 1.5 16.5v-9Zm19.5 0A1.5 1.5 0 0 0 19.5 6h-1.5v12h1.5a1.5 1.5 0 0 0 1.5-1.5v-9ZM6.75 7.5h1.5v3h-1.5v-3Zm1.5 4.5h-1.5v3h1.5v-3Zm-1.5 3.75H6v3h2.25v-3Zm3-3.75h1.5v3h-1.5v-3Zm1.5 4.5h-1.5v3h1.5v-3Zm-1.5 3.75h-1.5v3h1.5v-3Zm3-3.75h1.5v3h-1.5v-3Zm1.5 4.5h-1.5v3h1.5v-3Zm-1.5 3.75h-1.5v3h1.5v-3Zm3-3.75h1.5v3h-1.5v-3Zm1.5 4.5h-1.5v3h1.5v-3Z" />
  </svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
  </svg>
);

export const MinusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 0 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
</svg>
);

export const PencilSquareIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
  </svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9ZM12 3.25a.75.75 0 0 1 .75.75v.008l.008.008.008.008.008.008.008.008.008.008.008.008.007.008.007.007.007.007.007.007.007.007.006.007.006.006.006.006.006.006.006.006.005.006.005.005.005.005.005.005.005.005a.75.75 0 0 1-.75.75h-.008l-.008-.008L12 4.008l-.008-.008-.008-.008-.008-.008-.008-.008-.008-.007-.007-.007-.007-.007-.007-.006-.006-.006-.006-.006-.006-.005-.005-.005-.005-.005-.005-.005A.75.75 0 0 1 12 3.25Z" clipRule="evenodd" />
  </svg>
);

export const EyeDropperIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
  <path d="M11.03 2.59a1.5 1.5 0 0 1 1.94 0l7.5 6.363a1.5 1.5 0 0 1 .53 1.144V19.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3.03a.75.75 0 0 0-.394-.676l-2.093-1.047a.75.75 0 0 0-.812.111l-3.76 4.218a.75.75 0 0 1-1.14-.994l3.912-4.385a.75.75 0 0 0-.162-.87L5.03 9.097a1.5 1.5 0 0 1 .53-1.144l7.5-6.363ZM12 7.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" />
  <path d="m13.61 15.328.01-.005.01-.005.009-.005a2.252 2.252 0 0 1 .794-.412l.09-.025a2.25 2.25 0 0 1 2.274 1.345l.247.556A2.25 2.25 0 0 1 19.5 17.25h.035A2.25 2.25 0 0 1 21.75 15V9.637a3 3 0 0 0-1.06-2.288l-7.5-6.364a3 3 0 0 0-3.88 0l-7.5 6.364a3 3 0 0 0-1.06 2.288V15a2.25 2.25 0 0 0 2.25 2.25h.035c.495 0 .964-.159 1.345-.44l.247-.177a2.25 2.25 0 0 1 2.274-.09l.09.025c.29.077.56.205.794.377l.01.005.01.005.009.005a2.25 2.25 0 0 0 2.274 0l.009-.005.01-.005.01-.005Z" />
</svg>
);

export const MagicWandIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
    <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.98 1.567L9.05 7.123A7.494 7.494 0 0 0 7.124 9.05l-3.305.798c-.904.282-1.567.988-1.567 1.912v.016c0 .924.663 1.7 1.567 1.98l3.305.798a7.494 7.494 0 0 0 1.927 1.927l.798 3.305c.281.904.987 1.567 1.912 1.567h.016c.924 0 1.699-.663 1.98-1.567l.798-3.305a7.494 7.494 0 0 0 1.927-1.927l3.305-.798c.904-.282 1.567-.988 1.567-1.912v-.016c0-.924-.663 1.7-1.567-1.98l-3.305-.798a7.494 7.494 0 0 0-1.927-1.927L13.824 3.817c-.282-.904-.988-1.567-1.912-1.567h-.084Zm1.414 11.25a1.125 1.125 0 1 0-2.25 0 1.125 1.125 0 0 0 2.25 0Z" clipRule="evenodd" />
  </svg>
);

export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
  <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v3.75A3.75 3.75 0 0 1 16.5 22.5h-9A3.75 3.75 0 0 1 3.75 18.75V5.25A3.75 3.75 0 0 1 5.625 1.5ZM12.75 12.75a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0v-2.25Z" clipRule="evenodd" />
  <path d="M12.991 8.25a.75.75 0 0 0-1.24-.563l-3 3a.75.75 0 0 0-.22.563v3.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.22-.563l-3-3Z" />
  <path d="M13.125 3.375a2.25 2.25 0 0 0-2.25 2.25V7.5h1.875a3.75 3.75 0 0 1 3.75 3.75H18.75v-1.875a2.25 2.25 0 0 0-2.25-2.25H13.125Z" />
</svg>
);

export const SpeakerWaveIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
  <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
</svg>
);

export const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3.75a2.25 2.25 0 0 0-2.25 2.25v10.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V6a2.25 2.25 0 0 0-2.25-2.25Z" clipRule="evenodd" />
    <path d="M3.75 9.75a2.25 2.25 0 0 0-2.25 2.25v4.5a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25v-4.5a2.25 2.25 0 0 0-2.25-2.25H15a.75.75 0 0 1 0-1.5h5.25a3.75 3.75 0 0 1 3.75 3.75v4.5a3.75 3.75 0 0 1-3.75 3.75H3.75a3.75 3.75 0 0 1-3.75-3.75v-4.5A3.75 3.75 0 0 1 3.75 8.25H9a.75.75 0 0 1 0 1.5H3.75Z" />
  </svg>
);


export const AVAILABLE_FONTS = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Comic Sans MS'];

export const FILTER_OPTIONS: FilterOption[] = [
  { name: 'None', value: null },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Invert', value: 'invert(100%)' },
  { name: 'Blur', value: 'blur(3px)' },
  { name: 'Brightness', value: 'brightness(150%)' },
  { name: 'Contrast', value: 'contrast(200%)' },
  { name: 'Vintage', value: 'sepia(60%) contrast(75%) brightness(120%) saturate(70%)' },
  { name: 'Cool', value: 'contrast(150%) saturate(200%) hue-rotate(-15deg)' },
  { name: 'Warm', value: 'sepia(30%) saturate(150%) hue-rotate(10deg)' },
];

export const DEFAULT_PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/ai-video-studio/1280/720';
