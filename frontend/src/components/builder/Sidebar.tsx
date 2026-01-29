import React from 'react';
import { Type, Image as ImageIcon, Square, BarChart3, Box, Layers, PlayCircle, Globe, SeparatorHorizontal, Layout, Database, PanelTop, Newspaper, FileText } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

const SidebarItem = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `draggable - ${id} `,
        data: { type: id, isSidebar: true },
    });

    // We don't want the original item to move, we want a clone or just the visual feedback.
    // For dnd-kit, usually we use a DragOverlay for the moving part.
    // But for simple start, let's just make it draggable.

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-grab hover:border-blue-500 hover:shadow-sm transition-all active:cursor-grabbing group"
        >
            <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                {icon}
            </div>
            <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{label}</span>
        </div>
    );
};

export const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full bg-white/50 backdrop-blur-xl">
            <div className="p-4 border-b border-gray-100 bg-white shadow-sm z-10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Components</h2>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                    <SidebarItem id="text" label="Text Block" icon={<Type size={20} />} />
                    <SidebarItem id="button" label="Button" icon={<Square size={20} />} />
                    <SidebarItem id="image" label="Image" icon={<ImageIcon size={20} />} />
                    <SidebarItem id="video" label="YouTube" icon={<PlayCircle size={20} />} />
                    <SidebarItem id="product_grid" label="Product Grid" icon={<Box size={20} />} />
                    <SidebarItem id="slider" label="Carousel" icon={<Layers size={20} />} />
                    <SidebarItem id="webview" label="Web View" icon={<Globe size={20} />} />
                    <SidebarItem id="spacer" label="Spacer" icon={<SeparatorHorizontal size={20} />} />
                    <SidebarItem id="container" label="Container" icon={<Box size={20} />} />
                    <SidebarItem id="chart" label="Chart" icon={<BarChart3 size={20} />} />
                    <SidebarItem id="bottom_nav" label="NavBar" icon={<Box size={20} />} />
                    <SidebarItem id="toolbar" label="Toolbar" icon={<PanelTop size={20} />} />
                    <SidebarItem id="product_detail" label="Detail Card" icon={<Layout size={20} />} />
                    <SidebarItem id="news_grid" label="News Grid" icon={<Newspaper size={20} />} />
                    <SidebarItem id="news_detail" label="News Detail" icon={<FileText size={20} />} />
                </div>

                <div className="mt-8 mb-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-xs font-bold text-blue-800 mb-2">Pro Tip 💡</h3>
                        <p className="text-[10px] text-blue-600 leading-relaxed">
                            Drag "Product Grid" to display your Google Sheet items automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
