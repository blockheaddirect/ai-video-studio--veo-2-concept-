# Improvement Plan for Directory Structure

## Current Issues
1. **Redundant Directories**:
   - `components/` and `client/components/` both exist.
   - `contexts/` and `client/contexts/` are duplicated.

2. **Unclear Separation**:
   - Some files in `shared/` overlap with `services/`.

3. **Root Directory Clutter**:
   - Too many configuration files in the root.

## Proposed Changes
1. **Consolidate Directories**:
   - Merge `components/` into `client/components/`.
   - Merge `contexts/` into `client/contexts/`.

2. **Organize Shared Files**:
   - Move shared services into `shared/services/`.

3. **Streamline Root Directory**:
   - Move configuration files into a `config/` directory.

## Final Structure
```
config/
	jest.config.js
	tsconfig.json
	vite.config.ts
	metadata.json
	package.json
	README.md
src/
	App.tsx
	constants.tsx
	index.html
	index.tsx
	types.ts
	__test__/
		tests/
			logs/
				README.md
			tests/
				ffmpegService.test.ts
				geminiService.test.ts
				generateId.test.ts
				handleShowError.test.ts
				README.md
				updateCurrentTopic.test.ts
	backend/
		README.md
	client/
		contexts/
			hooks/
				useAIFeatures.ts
				useSidebarActions.ts
		components/
			Button.tsx
			LoadingSpinner.tsx
			MediaBin.tsx
			Modal.tsx
			PreviewWindow.tsx
			Sidebar.tsx
			StoryboardLane.tsx
	logs/
		README.md
	services/
		ffmpegService.ts
		geminiService.ts
	shared/
		README.md
		services/
	utils/
		errorHandler.ts
```
