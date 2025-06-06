
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { StoryboardItem, MediaAsset } from '../types';
import { Button } from './Button';
import { MinusCircleIcon, PencilSquareIcon } from '../constants';

interface StoryboardLaneProps {
  items: StoryboardItem[];
  mediaAssets: MediaAsset[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveItem: (startIndex: number, endIndex: number) => void;
}

export const StoryboardLane: React.FC<StoryboardLaneProps> = ({
  items,
  mediaAssets,
  selectedItemId,
  onSelectItem,
  onRemoveItem,
  onMoveItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-text-muted border-2 border-dashed border-border rounded-lg">
        <p>Add scenes from the Media Bin to build your video.</p>
      </div>
    );
  }

  const getAssetSrc = (assetId: string) => {
    return mediaAssets.find(asset => asset.id === assetId)?.src || 'https://picsum.photos/160/90';
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onMoveItem(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="storyboardLane" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="bg-surface p-3 rounded-lg h-40 overflow-x-auto whitespace-nowrap flex space-x-3"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(providedDraggable) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                    onClick={() => onSelectItem(item.id)}
                    className={`relative w-36 h-full p-1.5 rounded-md cursor-pointer transition-all duration-150 ease-in-out group
                      ${selectedItemId === item.id ? 'ring-2 ring-primary shadow-lg' : 'hover:bg-surface-alt'}
                      bg-slate-700
                    `}
                  >
                    <img
                      src={getAssetSrc(item.assetId)}
                      alt={`Storyboard item ${index + 1}`}
                      className="w-full h-20 object-cover rounded-sm"
                    />
                    <p className="text-xs text-center mt-1 truncate text-text-muted">
                      Scene {index + 1} ({item.duration}s)
                    </p>
                    {item.textOverlays.length > 0 &&
                      <PencilSquareIcon className="w-3 h-3 absolute top-2 right-2 text-sky-400" title={`${item.textOverlays.length} text overlay(s)`} />
                    }
                    {item.filter &&
                       <div className="w-3 h-3 absolute top-2 left-2 rounded-full border border-slate-400" style={{ background: item.filter.includes('sepia') ? 'SaddleBrown' : (item.filter.includes('grayscale') ? 'gray' : 'transparent') }} title={`Filter: ${item.filter}`}></div>
                    }
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }}
                      className="absolute -top-2 -right-2 p-0.5 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from storyboard"
                    >
                      <MinusCircleIcon className="w-full h-full" />
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
