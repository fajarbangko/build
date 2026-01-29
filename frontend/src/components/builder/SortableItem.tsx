import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { Trash2, Grid, ChevronLeft, Newspaper, FileText } from 'lucide-react';

const AutoSlider = ({ items, isPreview }: { items: { id: string; src: string; text?: string; onClick?: () => void }[], isPreview: boolean }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        if (!isPreview || items.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => {
                const next = (prev + 1) % items.length;
                if (scrollRef.current) {
                    const width = scrollRef.current.offsetWidth;
                    scrollRef.current.scrollTo({ left: next * width, behavior: 'smooth' });
                }
                return next;
            });
        }, 3000); // 3 seconds auto slide

        return () => clearInterval(interval);
    }, [isPreview, items.length]);

    // Handle manual scroll update
    const handleScroll = () => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            const index = Math.round(scrollRef.current.scrollLeft / width);
            setActiveIndex(index);
        }
    };

    return (
        <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg relative overflow-hidden group">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar relative"
                style={{ scrollBehavior: 'smooth' }}
            >
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className={`min-w-full h-full snap-center relative flex-shrink-0 ${item.onClick ? 'cursor-pointer' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.onClick) item.onClick();
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.src} className="w-full h-full object-cover" alt="Slide" />
                        {item.text && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                                {item.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Dots Indicator */}
            {items.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {items.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};
import { AppComponent, useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';

interface SortableItemProps {
    component: AppComponent;
}

export const SortableItem = ({ component }: SortableItemProps) => {
    const { selectComponent, selectedId, removeComponent, isPreviewMode, setActiveScreen } = useAppStore();
    const { data, selectedRow, setSelectedRow } = useDataStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id, disabled: isPreviewMode });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: component.props.width || '100%',
        marginTop: component.props.marginTop ?? undefined,
        marginRight: component.props.marginRight ?? undefined,
        marginBottom: component.props.marginBottom ?? undefined,
        marginLeft: component.props.marginLeft ?? undefined,
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.3 : 1,
    };

    // Helper to render slider content
    const renderSlider = () => {
        // Normalize items
        let items: { id: string; src: string; text?: string; onClick?: () => void }[] = [];

        if (component.props.dataBind_src && data.length > 0) {
            // Data Binding Mode
            items = data.map((row, i) => ({
                id: `slide-data-${i}`,
                src: String(row[component.props.dataBind_src!] || ''),
                text: component.props.dataBind_text ? String(row[component.props.dataBind_text] || '') : undefined
            }));
        } else if (component.props.slides && component.props.slides.length > 0) {
            // Manual Mode
            items = component.props.slides.map((s: any, i: number) => ({
                id: s.id || `slide-${i}`,
                src: s.src,
                onClick: () => {
                    if (isPreviewMode && s.targetScreenId) {
                        setActiveScreen(s.targetScreenId);
                    }
                }
            }));
        } else {
            // Placeholder Mode
            return (
                <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 flex transition-transform ease-linear duration-500">
                        <div className="min-w-full h-full bg-blue-100 flex items-center justify-center text-gray-500">Slide 1</div>
                    </div>
                </div>
            );
        }

        return <AutoSlider items={items} isPreview={isPreviewMode} />;
    };

    // Helper to replace placeholders in URL with data
    const formatUrl = (url: string) => {
        let result = url;
        const sourceData = selectedRow || (data.length > 0 ? data[0] : {});

        Object.keys(sourceData).forEach(key => {
            result = result.replace(`{${key}}`, String(sourceData[key]));
        });
        return result;
    };

    const handleGridItemClick = (row: any) => {
        if (isPreviewMode && component.props.itemActionType === 'navigate' && component.props.itemTargetScreenId) {
            setSelectedRow(row);
            setActiveScreen(component.props.itemTargetScreenId);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPreviewMode) {
            // INTERACTIVE MODE
            if (component.type === 'button') {
                if (component.props.actionType === 'navigate' && component.props.targetScreenId) {
                    setActiveScreen(component.props.targetScreenId);
                } else if (component.props.actionType === 'open_url' && component.props.urlTarget) {
                    const finalUrl = formatUrl(component.props.urlTarget);
                    window.open(finalUrl, '_blank');
                } else if (component.props.actionType === 'alert') {
                    alert("Alert Action Triggered!");
                }
            }
        } else {
            // EDIT MODE
            selectComponent(component.id);
        }
    };

    // Helper to get text (bound or static)
    const getText = () => {
        if (component.props.dataBind_text) {
            if (selectedRow && selectedRow[component.props.dataBind_text]) {
                return String(selectedRow[component.props.dataBind_text]);
            }
            if (data.length > 0) {
                return String(data[0][component.props.dataBind_text]);
            }
        }
        return component.props.text || 'Text Block';
    };

    // Helper to get image src (bound or static)
    const getSrc = () => {
        if (component.props.dataBind_src) {
            if (selectedRow && selectedRow[component.props.dataBind_src]) {
                return String(selectedRow[component.props.dataBind_src]);
            }
            if (data.length > 0) {
                return String(data[0][component.props.dataBind_src]);
            }
        }
        return component.props.src || "https://placehold.co/600x400/e2e8f0/94a3b8?text=Image";
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={clsx(
                "group relative p-2 border-2 rounded transition-all cursor-pointer box-border",
                selectedId === component.id && !isPreviewMode ? "border-blue-500 ring-2 ring-blue-100" : "border-transparent hover:border-gray-200"
            )}
        >
            {/* Render based on type */}
            {component.type === 'text' && (
                <p className="text-gray-800" style={{ fontSize: component.props.size || 16, fontWeight: component.props.bold ? 'bold' : 'normal' }}>
                    {getText()}
                </p>
            )}
            {component.type === 'button' && (
                <button className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-sm active:bg-blue-700 ${!isPreviewMode ? 'pointer-events-none' : ''}`}>
                    {getText()}
                </button>
            )}
            {component.type === 'image' && (
                <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center overflow-hidden pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getSrc()} alt="placeholder" className="w-full h-full object-cover" />
                </div>
            )}
            {component.type === 'chart' && (
                <div className="bg-white border rounded-xl p-4 shadow-sm pointer-events-none">
                    <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase">Sales Overview</h3>
                    <div className="flex items-end gap-2 h-32">
                        {[40, 70, 45, 90, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%`, opacity: 0.5 + (i * 0.1) }}></div>
                        ))}
                    </div>
                </div>
            )}
            {component.type === 'container' && (
                <div className="p-4 border border-dashed border-gray-300 rounded min-h-[100px] flex items-center justify-center bg-gray-50">
                    <span className="text-xs text-gray-400">Container</span>
                </div>
            )}
            {component.type === 'slider' && renderSlider()}
            {component.type === 'product_grid' && (
                <div className="w-full min-h-[100px] bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200">
                    {data.length > 0 ? (
                        <div className={`grid gap-2 ${component.props.gridColumns === 1 ? 'grid-cols-1' :
                            component.props.gridColumns === 3 ? 'grid-cols-3' :
                                'grid-cols-2'
                            }`}>
                            {data
                                .filter(row => {
                                    if (!component.props.filterColumn || !component.props.filterValue) return true;
                                    const cellValue = String(row[component.props.filterColumn] || '').toLowerCase();
                                    const filterValue = String(component.props.filterValue).toLowerCase();
                                    return cellValue.includes(filterValue);
                                })
                                .slice(0, component.props.limit || 100) // Apply Limit
                                .map((row, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded shadow-sm overflow-hidden flex flex-col active:scale-95 transition-transform"
                                        onClick={(e) => { e.stopPropagation(); handleGridItemClick(row); }}
                                    >
                                        <div className={`bg-gray-100 relative ${component.props.gridColumns === 1 ? 'aspect-video' : 'aspect-square'}`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={component.props.bind_image ? String(row[component.props.bind_image] || '') : "https://placehold.co/150"}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                        <div className="p-2">
                                            <div className="font-bold text-xs truncate">
                                                {component.props.bind_title ? row[component.props.bind_title] : `Item ${i + 1}`}
                                            </div>
                                            <div className="text-[10px] text-gray-500 truncate">
                                                {component.props.bind_subtitle ? row[component.props.bind_subtitle] : `$${(i + 1) * 10}`}
                                            </div>
                                            <button className="mt-2 w-full bg-blue-600 text-white text-[10px] py-1 rounded">
                                                {component.props.buttonText || 'Buy'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                            <Grid size={24} className="mb-2 opacity-50" />
                            <span className="text-xs">Product Grid (Connect Data to see items)</span>
                        </div>
                    )}
                </div>
            )}

            {component.type === 'news_grid' && (
                <div className="w-full min-h-[100px] bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200">
                    {data.length > 0 ? (
                        <div className={`grid gap-3 ${component.props.gridColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'
                            }`}>
                            {data
                                .filter(row => {
                                    if (!component.props.filterColumn || !component.props.filterValue) return true;
                                    const cellValue = String(row[component.props.filterColumn] || '').toLowerCase();
                                    const filterValue = String(component.props.filterValue).toLowerCase();
                                    return cellValue.includes(filterValue);
                                })
                                .slice(0, component.props.limit || 100)
                                .map((row, i) => (
                                    <div
                                        key={i}
                                        className={`bg-white rounded-lg shadow-sm overflow-hidden flex active:bg-gray-50 transition-colors cursor-pointer ${component.props.gridColumns === 2 ? 'flex-col' : 'flex-row h-24'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isPreviewMode) {
                                                setSelectedRow(row);
                                                // Auto navigate to news detail if actionTarget is set or try to find a news detail page?
                                                // Better to rely on manual 'actionTarget' prop, or allow user to set it.
                                                // The user specifically asked for "item detail page news".
                                                if (component.props.actionTarget) setActiveScreen(component.props.actionTarget);
                                            }
                                        }}
                                    >
                                        {/* Image */}
                                        <div className={`bg-gray-200 relative ${component.props.gridColumns === 2 ? 'aspect-video w-full' : 'w-24 h-full shrink-0'}`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={component.props.bind_image ? String(row[component.props.bind_image] || '') : "https://placehold.co/150"}
                                                className="w-full h-full object-cover"
                                                alt="News"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 flex-1 flex flex-col justify-center">
                                            <div className="text-[10px] text-gray-500 mb-1">
                                                {component.props.bind_date ? row[component.props.bind_date] : '12 Oct 2023'}
                                            </div>
                                            <h3 className="font-bold text-sm text-gray-900 leading-tight line-clamp-2 mb-1">
                                                {component.props.bind_title ? row[component.props.bind_title] : `News Title ${i + 1}`}
                                            </h3>
                                            {component.props.bind_summary && (
                                                <p className="text-[10px] text-gray-600 line-clamp-2">
                                                    {row[component.props.bind_summary]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                            <Newspaper size={24} className="mb-2 opacity-50" />
                            <span className="text-xs">News Grid (Connect Data)</span>
                        </div>
                    )}
                </div>
            )}

            {component.type === 'news_detail' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden pb-8">
                    {/* Hero Image */}
                    <div className="w-full h-56 bg-gray-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={
                                (component.props.dataBind_src && selectedRow && selectedRow[component.props.dataBind_src]) ||
                                (component.props.dataBind_image && selectedRow && selectedRow[component.props.dataBind_image]) ||
                                component.props.src ||
                                'https://placehold.co/800x400/f3f4f6/9ca3af?text=News+Image'
                            }
                            className="w-full h-full object-cover"
                            alt="News"
                        />
                    </div>

                    {/* Content Body */}
                    <div className="p-5">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded mb-3">
                            {component.props.dataBind_date && selectedRow ? selectedRow[component.props.dataBind_date] : 'News Category / Date'}
                        </span>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                            {component.props.dataBind_title && selectedRow ? selectedRow[component.props.dataBind_title] : (component.props.title || 'Headline News Title')}
                        </h1>

                        <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {
                                (component.props.dataBind_content && selectedRow && selectedRow[component.props.dataBind_content]) ||
                                (component.props.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...')
                            }
                        </div>
                    </div>
                </div>
            )}

            {component.type === 'video' && (
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
                    {(() => {
                        const src = component.props.src || '';
                        let videoId = '';

                        // Smart ID Extraction
                        if (src.includes('v=')) {
                            videoId = src.split('v=')[1]?.split('&')[0];
                        } else if (src.includes('youtu.be/')) {
                            videoId = src.split('youtu.be/')[1]?.split('?')[0];
                        } else if (src.includes('embed/')) {
                            videoId = src.split('embed/')[1]?.split('?')[0];
                        } else if (!src.includes('/') && src.length > 5) {
                            // Assume it is a direct ID
                            videoId = src;
                        }

                        return videoId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className={`w-full h-full ${!isPreviewMode ? 'pointer-events-none' : ''}`}
                                title="Video"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <span className="block text-2xl mb-1">▶️</span>
                                    <span className="text-xs">Enter YouTube URL or ID</span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {component.type === 'webview' && (
                <div
                    style={{ height: component.props.sizeMode === 'full' ? 'calc(100vh - 100px)' : (component.props.height || 300) }}
                    className="w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative transition-all"
                >
                    {component.props.src ? (
                        <iframe
                            src={component.props.src}
                            className={`w-full h-full ${!isPreviewMode ? 'pointer-events-none' : ''}`}
                            title="Webview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <span className="text-xs">🌐 Webview Component</span>
                        </div>
                    )}
                    <div className="absolute inset-0 z-10 pointer-events-none"></div>
                </div>
            )}

            {component.type === 'spacer' && (
                <div
                    style={{ height: component.props.height || 20 }}
                    className={clsx("w-full transition-all", !isPreviewMode && "border border-dashed border-gray-300 bg-gray-50/50 relative group-hover:border-blue-300")}
                >
                    {!isPreviewMode && <span className="absolute top-0 right-0 text-[8px] text-gray-400 p-1">Spacer {component.props.height}px</span>}
                </div>
            )}

            {component.type === 'bottom_nav' && (
                <div className="w-full h-14 bg-white border-t flex items-center justify-around absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
                    <div className="flex flex-col items-center gap-1 opacity-50"><div className="w-5 h-5 bg-gray-300 rounded"></div><span className="text-[10px]">Home</span></div>
                    <div className="flex flex-col items-center gap-1 opacity-50"><div className="w-5 h-5 bg-gray-300 rounded"></div><span className="text-[10px]">Search</span></div>
                    <div className="flex flex-col items-center gap-1 opacity-50"><div className="w-5 h-5 bg-gray-300 rounded"></div><span className="text-[10px]">Profile</span></div>
                </div>
            )}

            {component.type === 'toolbar' && (
                <div
                    // Native App Header Style:
                    // 1. Break out of parent padding: w-[calc(100%+2rem)] -mt-4 -mx-4
                    // 2. Standard Height: h-[56px]
                    // 3. Elevation: shadow-sm
                    className="w-[calc(100%+2rem)] h-[56px] -mt-4 -ml-4 -mr-4 px-4 flex items-center gap-3 shadow-md z-30 relative mb-4"
                    style={{
                        backgroundColor: component.props.backgroundColor || '#ffffff',
                        color: component.props.textColor || '#000000'
                    }}
                >
                    {component.props.showBack !== false && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isPreviewMode) {
                                    // Simple logic: Go to Home or specified target
                                    if (component.props.backTarget) {
                                        setActiveScreen(component.props.backTarget);
                                    } else {
                                        setActiveScreen('screen-home'); // Default fallback
                                    }
                                }
                            }}
                            className={`p-1 -ml-1 rounded-full hover:bg-black/10 transition-colors ${!isPreviewMode ? 'pointer-events-none' : ''}`}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <h1 className="font-bold text-lg leading-none" style={{ color: component.props.textColor || '#000000' }}>
                        {component.props.title || 'Page Title'}
                    </h1>
                </div>
            )}

            {component.type === 'product_detail' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Hero Image */}
                    <div className="w-full h-64 bg-gray-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={
                                (component.props.dataBind_src && selectedRow && selectedRow[component.props.dataBind_src]) ||
                                (component.props.dataBind_image && selectedRow && selectedRow[component.props.dataBind_image]) ||
                                component.props.src ||
                                'https://placehold.co/600x600/f3f4f6/9ca3af?text=Product+Image'
                            }
                            className="w-full h-full object-cover"
                            alt="Product"
                        />
                    </div>

                    {/* Content Body */}
                    <div className="p-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {component.props.dataBind_title && selectedRow ? selectedRow[component.props.dataBind_title] : (component.props.title || 'Product Name')}
                        </h2>

                        <p className="text-lg font-bold text-blue-600 mb-4">
                            {component.props.dataBind_price && selectedRow ? selectedRow[component.props.dataBind_price] : (component.props.price || 'Rp 0')}
                        </p>

                        <div className="prose prose-sm text-gray-600 mb-6">
                            <p>
                                {
                                    (component.props.dataBind_desc && selectedRow && selectedRow[component.props.dataBind_desc]) ||
                                    (component.props.dataBind_description && selectedRow && selectedRow[component.props.dataBind_description]) ||
                                    (component.props.description || 'Product description goes here...')
                                }
                            </p>
                        </div>

                        {/* Buy Button */}
                        <button
                            className={`w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all ${!isPreviewMode ? 'pointer-events-none' : ''}`}
                            onClick={(e) => {
                                if (isPreviewMode) {
                                    const phone = '6281234567890'; // Default, needs prop
                                    const title = component.props.dataBind_title && selectedRow ? selectedRow[component.props.dataBind_title] : (component.props.title || 'Item');
                                    const price = component.props.dataBind_price && selectedRow ? selectedRow[component.props.dataBind_price] : (component.props.price || '0');

                                    // Construct WhatsApp Link
                                    const text = `Halo, saya mau beli ${title} seharga ${price}`;
                                    const url = `https://wa.me/${component.props.whatsappNumber || phone}?text=${encodeURIComponent(text)}`;
                                    window.open(url, '_blank');
                                }
                            }}
                        >
                            <span>🛍️</span>
                            {component.props.buttonLabel || 'Beli Sekarang'}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Handler Wrapper */}
            {selectedId === component.id && (
                <button
                    onClick={(e) => { e.stopPropagation(); removeComponent(component.id); }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 z-50 cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );


};
