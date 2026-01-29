import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useAppStore } from '@/stores/appStore';
import { clsx } from 'clsx';
import { Trash2 } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export const Canvas = ({ isNative }: { isNative?: boolean }) => {
    const { screens, activeScreenId, removeComponent, selectComponent, selectedId } = useAppStore();
    const components = screens.find(s => s.id === activeScreenId)?.components || [];

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable',
    });

    if (isNative) {
        return (
            <div className="w-full h-screen bg-white overflow-y-auto no-scrollbar">
                <div className="space-y-4 pb-10 flex flex-wrap content-start items-start p-4">
                    <SortableContext items={components.map(c => c.id)} strategy={rectSortingStrategy}>
                        {components.map((comp) => (
                            <SortableItem key={comp.id} component={comp} />
                        ))}
                    </SortableContext>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-100 flex justify-center items-center p-8 overflow-hidden select-none">
            {/* Mobile Frame */}
            <div
                className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 relative overflow-hidden flex flex-col"
            >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-20"></div>

                {/* Status Bar */}
                <div className="h-12 w-full bg-white z-10 flex items-end justify-between px-6 pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-black">9:41</span>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full bg-black/10"></div>
                        <div className="w-4 h-4 rounded-full bg-black/10"></div>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    ref={setNodeRef}
                    className={clsx(
                        "flex-1 overflow-y-auto p-4 transition-colors no-scrollbar",
                        isOver ? "bg-blue-50" : "bg-white"
                    )}
                >
                    {components.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-sm">Drag components here</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-10 flex flex-wrap content-start items-start">
                            <SortableContext items={components.map(c => c.id)} strategy={rectSortingStrategy}>
                                {components.map((comp) => (
                                    <SortableItem key={comp.id} component={comp} />
                                ))}
                            </SortableContext>
                        </div>
                    )}
                </div>

                {/* Home Indicator */}
                <div className="h-8 w-full bg-white flex justify-center pt-2 border-t border-gray-100">
                    <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};
