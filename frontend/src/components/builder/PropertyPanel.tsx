import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';
import { Type, Image, Hash, Layout, Database, Trash2 } from 'lucide-react';

export const PropertyPanel = () => {
    const { screens, activeScreenId, selectedId, updateComponent } = useAppStore();
    const { columns } = useDataStore();

    const components = screens.find(s => s.id === activeScreenId)?.components || [];
    const selectedComponent = components.find((c) => c.id === selectedId);

    const [localProps, setLocalProps] = useState<Record<string, any>>({});

    useEffect(() => {
        if (selectedComponent) {
            setLocalProps(selectedComponent.props);
        } else {
            setLocalProps({});
        }
    }, [selectedComponent?.id]);

    const handleChange = (key: string, value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);
        updateComponent(selectedComponent!.id, newProps);
    };

    if (!selectedComponent) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-4 hidden lg:flex flex-col h-full overflow-y-auto">
                <h2 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wider">Properties</h2>
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Layout size={40} className="mb-2 opacity-20" />
                    <p className="text-sm">Select a component</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-gray-200 p-4 hidden lg:flex flex-col h-full overflow-y-auto">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-6 tracking-wider flex items-center gap-2">
                Properties
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] normal-case">
                    {selectedComponent.type}
                </span>
            </h2>

            <div className="space-y-6">
                {/* General Properties */}
                <div className="space-y-4">
                    {/* TEXT Properties */}
                    {selectedComponent.type === 'text' && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Text Content</label>
                                <textarea
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    rows={3}
                                    value={localProps.text || 'Text Block'}
                                    onChange={(e) => handleChange('text', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                                    <input
                                        type="number"
                                        className="w-20 text-sm border border-gray-200 rounded p-1"
                                        value={localProps.size || 16}
                                        onChange={(e) => handleChange('size', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <input
                                        type="checkbox"
                                        id="bold"
                                        checked={localProps.bold || false}
                                        onChange={(e) => handleChange('bold', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="bold" className="text-sm text-gray-600">Bold</label>
                                </div>
                            </div>
                        </>
                    )}

                    {/* BUTTON Properties */}
                    {selectedComponent.type === 'button' && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                                <input
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                    value={localProps.label || 'Action Button'}
                                    onChange={(e) => handleChange('label', e.target.value)}
                                />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <label className="block text-xs font-medium text-gray-900 mb-2">On Click Action</label>
                                <select
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2 mb-2"
                                    value={localProps.actionType || 'none'}
                                    onChange={(e) => handleChange('actionType', e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="navigate">Navigate To Page</option>
                                    <option value="alert">Show Alert</option>
                                    <option value="open_url">Open URL / WhatsApp</option>
                                </select>

                                {localProps.actionType === 'open_url' && (
                                    <div className="mt-2">
                                        <label className="block text-[10px] text-gray-500 mb-1">URL (Use {'{col}'} for dynamic data)</label>
                                        <input
                                            className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                            placeholder="https://wa.me/628123?text=Buy {Title}"
                                            value={localProps.urlTarget || ''}
                                            onChange={(e) => handleChange('urlTarget', e.target.value)}
                                        />
                                    </div>
                                )}

                                {localProps.actionType === 'navigate' && (
                                    <select
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                        value={localProps.targetScreenId || ''}
                                        onChange={(e) => handleChange('targetScreenId', e.target.value)}
                                    >
                                        <option value="">Select Screen...</option>
                                        {screens.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </>
                    )}

                    {/* IMAGE Properties */}
                    {selectedComponent.type === 'image' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                placeholder="https://..."
                                value={localProps.src || ''}
                                onChange={(e) => handleChange('src', e.target.value)}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Paste a valid image URL</p>
                        </div>
                    )}

                    {/* SLIDER Properties (Manual Slides) */}
                    {selectedComponent.type === 'slider' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-gray-700">Slides</label>
                                <button
                                    onClick={() => {
                                        const currentSlides = localProps.slides || [];
                                        const newSlide = { id: crypto.randomUUID(), src: 'https://placehold.co/600x300', targetScreenId: '' };
                                        handleChange('slides', [...currentSlides, newSlide]);
                                    }}
                                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-medium"
                                >
                                    + Add Slide
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(localProps.slides || []).map((slide: any, index: number) => (
                                    <div key={slide.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                                        <button
                                            onClick={() => {
                                                const newSlides = localProps.slides.filter((s: any) => s.id !== slide.id);
                                                handleChange('slides', newSlides);
                                            }}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={12} />
                                        </button>

                                        <div className="mb-2">
                                            <label className="block text-[10px] text-gray-500 mb-1">Image URL #{index + 1}</label>
                                            <input
                                                className="w-full text-xs border border-gray-200 rounded p-1.5"
                                                value={slide.src}
                                                onChange={(e) => {
                                                    const newSlides = [...localProps.slides];
                                                    newSlides[index] = { ...slide, src: e.target.value };
                                                    handleChange('slides', newSlides);
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">On Click Navigate To</label>
                                            <select
                                                className="w-full text-xs border border-gray-200 rounded p-1.5"
                                                value={slide.targetScreenId || ''}
                                                onChange={(e) => {
                                                    const newSlides = [...localProps.slides];
                                                    newSlides[index] = { ...slide, targetScreenId: e.target.value };
                                                    handleChange('slides', newSlides);
                                                }}
                                            >
                                                <option value="">None</option>
                                                {screens.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}

                                {(localProps.slides || []).length === 0 && (
                                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-lg">
                                        <p className="text-[10px] text-gray-400">No slides added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PRODUCT GRID Properties */}
                    {selectedComponent.type === 'product_grid' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Columns</label>
                                <div className="flex gap-2">
                                    {[2, 3].map((cols) => (
                                        <button
                                            key={cols}
                                            onClick={() => handleChange('gridColumns', cols)}
                                            className={`flex-1 text-xs py-1.5 rounded border transition-colors ${(localProps.gridColumns || 2) === cols ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                        >
                                            {cols} Columns
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4 pt-4 border-t border-gray-100">
                                <label className="block text-xs font-medium text-gray-900 mb-2">Item Action (On Click)</label>
                                <select
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2 mb-2"
                                    value={localProps.itemActionType || 'none'}
                                    onChange={(e) => handleChange('itemActionType', e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="navigate">Navigate To Details Page</option>
                                </select>

                                {localProps.itemActionType === 'navigate' && (
                                    <select
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                        value={localProps.itemTargetScreenId || ''}
                                        onChange={(e) => handleChange('itemTargetScreenId', e.target.value)}
                                    >
                                        <option value="">Select Screen...</option>
                                        {screens.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </>
                    )}

                    {/* VIDEO Properties */}
                    {selectedComponent.type === 'video' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">YouTube URL or ID</label>
                            <input
                                className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                placeholder="https://youtube.com/watch?v=..."
                                value={localProps.src || ''}
                                onChange={(e) => handleChange('src', e.target.value)}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Supports URL or Video ID</p>
                        </div>
                    )}

                    {/* WEBVIEW Properties */}
                    {selectedComponent.type === 'webview' && (
                        <div>
                            <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Website URL</label>
                                <input
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                    placeholder="https://google.com"
                                    value={localProps.src || ''}
                                    onChange={(e) => handleChange('src', e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Size / Layout</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => handleChange('sizeMode', 'fixed')}
                                        className={`flex-1 py-1 text-[10px] font-medium rounded-md transition-all ${!localProps.sizeMode || localProps.sizeMode === 'fixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Fixed Height
                                    </button>
                                    <button
                                        onClick={() => handleChange('sizeMode', 'full')}
                                        className={`flex-1 py-1 text-[10px] font-medium rounded-md transition-all ${localProps.sizeMode === 'full' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Full Screen
                                    </button>
                                </div>
                            </div>

                            {(!localProps.sizeMode || localProps.sizeMode === 'fixed') && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
                                    <input
                                        type="number"
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                        placeholder="300"
                                        value={localProps.height || 300}
                                        onChange={(e) => handleChange('height', parseInt(e.target.value))}
                                    />
                                </div>
                            )}

                            <div className="mt-2 text-[10px] text-orange-500 bg-orange-50 p-2 rounded">
                                Note: Some websites refuse to load inside frames (X-Frame-Options).
                            </div>
                        </div>
                    )}

                    {/* SPACER Properties */}
                    {selectedComponent.type === 'spacer' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
                            <input
                                type="number"
                                className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                placeholder="20"
                                value={localProps.height || 20}
                                onChange={(e) => handleChange('height', parseInt(e.target.value))}
                            />
                        </div>
                    )}



                    {/* TOOLBAR Properties */}
                    {selectedComponent.type === 'toolbar' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Page Title</label>
                                <input
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                    value={localProps.title || ''}
                                    placeholder="My Page"
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showBack"
                                    checked={localProps.showBack !== false} // Default true
                                    onChange={(e) => handleChange('showBack', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="showBack" className="text-xs text-gray-700">Show Back Button</label>
                            </div>

                            {localProps.showBack !== false && (
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Back Target Screen</label>
                                    <select
                                        className="w-full text-xs border border-gray-200 rounded p-1.5"
                                        value={localProps.backTarget || 'screen-home'}
                                        onChange={(e) => handleChange('backTarget', e.target.value)}
                                    >
                                        <option value="screen-home">Home (Default)</option>
                                        {screens.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Background</label>
                                    <div className="flex items-center gap-1 border border-gray-200 rounded p-1">
                                        <input
                                            type="color"
                                            className="w-6 h-6 rounded cursor-pointer border-none"
                                            value={localProps.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                        />
                                        <input
                                            className="w-full text-[10px] outline-none"
                                            value={localProps.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Text Color</label>
                                    <div className="flex items-center gap-1 border border-gray-200 rounded p-1">
                                        <input
                                            type="color"
                                            className="w-6 h-6 rounded cursor-pointer border-none"
                                            value={localProps.textColor || '#000000'}
                                            onChange={(e) => handleChange('textColor', e.target.value)}
                                        />
                                        <input
                                            className="w-full text-[10px] outline-none"
                                            value={localProps.textColor || '#000000'}
                                            onChange={(e) => handleChange('textColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* PRODUCT DETAIL Properties */}
                    {selectedComponent.type === 'product_detail' && (
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <h3 className="text-xs font-bold text-blue-700 mb-2">WhatsApp Config</h3>
                                <div className="mb-2">
                                    <label className="block text-[10px] text-gray-500 mb-1">WhatsApp Number</label>
                                    <input
                                        className="w-full text-xs border border-gray-200 rounded p-1.5"
                                        placeholder="628..."
                                        value={localProps.whatsappNumber || ''}
                                        onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Button Label</label>
                                    <input
                                        className="w-full text-xs border border-gray-200 rounded p-1.5"
                                        placeholder="Beli Sekarang"
                                        value={localProps.buttonLabel || 'Beli Sekarang'}
                                        onChange={(e) => handleChange('buttonLabel', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1">
                                    <Database size={12} className="text-blue-600" /> Data Mapping
                                </h3>

                                <div className="space-y-3">
                                    {['Title', 'Price', 'Description', 'Image'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-[10px] uppercase text-gray-500 mb-1">Map {field}</label>
                                            <select
                                                className="w-full text-xs border border-gray-200 rounded p-1.5"
                                                value={localProps[`dataBind_${field.toLowerCase()}`] || ''}
                                                onChange={(e) => handleChange(`dataBind_${field.toLowerCase()}`, e.target.value)}
                                            >
                                                <option value="">-- Static / Fallback --</option>
                                                {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>

                                            {/* Static Fallback Input */}
                                            {!localProps[`dataBind_${field.toLowerCase()}`] && (
                                                <input
                                                    className="w-full text-xs border border-gray-200 rounded p-1.5 mt-1 bg-gray-50"
                                                    placeholder={`Static ${field}...`}
                                                    value={localProps[field.toLowerCase()] || ''}
                                                    onChange={(e) => handleChange(field.toLowerCase(), e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DATA BINDING SECTION */}
                    {columns.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1 mb-2 text-blue-600">
                                <Database size={12} />
                                <h3 className="text-xs font-bold uppercase">Data Binding</h3>
                            </div>

                            {(selectedComponent.type === 'product_grid' || selectedComponent.type === 'news_grid') && (
                                <div className="space-y-4 mb-4 pb-4 border-b border-gray-100">
                                    {/* Grid Layout Config */}
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Layout Mode</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleChange('gridColumns', 1)}
                                                className={`flex-1 py-1.5 text-xs border rounded ${localProps.gridColumns === 1 ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-200 text-gray-600'}`}
                                            >
                                                List (1x)
                                            </button>
                                            <button
                                                onClick={() => handleChange('gridColumns', 2)}
                                                className={`flex-1 py-1.5 text-xs border rounded ${localProps.gridColumns === 2 ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-200 text-gray-600'}`}
                                            >
                                                Grid (2x)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Data Filter Config */}
                                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                        <label className="block text-[10px] uppercase text-gray-500 mb-2 font-bold flex items-center gap-1">
                                            <Database size={10} /> Filter Data
                                        </label>

                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-[10px] text-gray-400 mb-0.5">By Column</label>
                                                <select
                                                    className="w-full text-xs border border-gray-200 rounded p-1"
                                                    value={localProps.filterColumn || ''}
                                                    onChange={(e) => handleChange('filterColumn', e.target.value)}
                                                >
                                                    <option value="">(No Filter)</option>
                                                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>

                                            {localProps.filterColumn && (
                                                <div>
                                                    <label className="block text-[10px] text-gray-400 mb-0.5">Value equals to</label>
                                                    <input
                                                        className="w-full text-xs border border-gray-200 rounded p-1"
                                                        placeholder="e.g. Food"
                                                        value={localProps.filterValue || ''}
                                                        onChange={(e) => handleChange('filterValue', e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedComponent.type === 'product_grid' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Map Image</label>
                                        <select
                                            className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                            value={localProps.bind_image || ''}
                                            onChange={(e) => handleChange('bind_image', e.target.value)}
                                        >
                                            <option value="">-- Select Column --</option>
                                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Map Title</label>
                                        <select
                                            className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                            value={localProps.bind_title || ''}
                                            onChange={(e) => handleChange('bind_title', e.target.value)}
                                        >
                                            <option value="">-- Select Column --</option>
                                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Map Subtitle/Price</label>
                                        <select
                                            className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                            value={localProps.bind_subtitle || ''}
                                            onChange={(e) => handleChange('bind_subtitle', e.target.value)}
                                        >
                                            <option value="">-- Select Column --</option>
                                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Button Text</label>
                                        <input
                                            className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                            value={localProps.buttonText || 'Buy'}
                                            placeholder="Buy"
                                            onChange={(e) => handleChange('buttonText', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* NEWS GRID MAPPINGS */}
                            {selectedComponent.type === 'news_grid' && (
                                <div className="space-y-3">
                                    <div className="p-2 bg-blue-50 text-[10px] text-blue-700 rounded mb-2">
                                        Map columns from your Sheet to the News Card.
                                    </div>
                                    {['Image', 'Title', 'Date', 'Summary'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-[10px] uppercase text-gray-500 mb-1">Map {field}</label>
                                            <select
                                                className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                                value={localProps[`bind_${field.toLowerCase()}`] || ''}
                                                onChange={(e) => handleChange(`bind_${field.toLowerCase()}`, e.target.value)}
                                            >
                                                <option value="">-- Select Column --</option>
                                                {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    ))}

                                    <div className="pt-2 border-t border-gray-100 mt-2">
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold text-blue-600">On Click Navigate To</label>
                                        <select
                                            className="w-full text-xs border border-blue-200 bg-blue-50 rounded p-1.5"
                                            value={localProps.actionTarget || ''}
                                            onChange={(e) => handleChange('actionTarget', e.target.value)}
                                        >
                                            <option value="">-- No Action --</option>
                                            {screens.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* NEWS DETAIL MAPPINGS */}
                            {selectedComponent.type === 'news_detail' && (
                                <div className="space-y-3">
                                    <div className="p-2 bg-blue-50 text-[10px] text-blue-700 rounded mb-2">
                                        Map columns for the Full Article view.
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Title', key: 'dataBind_title', fallback: 'title' },
                                            { label: 'Date/Category', key: 'dataBind_date', fallback: 'date' },
                                            { label: 'Content/Body', key: 'dataBind_content', fallback: 'description' },
                                            { label: 'Image', key: 'dataBind_src', fallback: 'src' }
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">Map {field.label}</label>
                                                <select
                                                    className="w-full text-xs border border-gray-200 rounded p-1.5"
                                                    value={localProps[field.key] || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                >
                                                    <option value="">-- Static / Fallback --</option>
                                                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>

                                                {/* Static Fallback */}
                                                {!localProps[field.key] && (
                                                    <input
                                                        className="w-full text-xs border border-gray-200 rounded p-1.5 mt-1 bg-gray-50"
                                                        placeholder={`Static ${field.label}...`}
                                                        value={localProps[field.fallback] || ''}
                                                        onChange={(e) => handleChange(field.fallback, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(selectedComponent.type === 'slider' || selectedComponent.type === 'image') && (
                                <div className="mb-2">
                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">Bind Image Source</label>
                                    <select
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                        value={localProps.dataBind_src || ''}
                                        onChange={(e) => handleChange('dataBind_src', e.target.value)}
                                    >
                                        <option value="">None (Static)</option>
                                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            )}

                            {(selectedComponent.type === 'text' || selectedComponent.type === 'button') && (
                                <div className="mb-2">
                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">Bind Label/Text</label>
                                    <select
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2"
                                        value={localProps.dataBind_text || ''}
                                        onChange={(e) => handleChange('dataBind_text', e.target.value)}
                                    >
                                        <option value="">None (Static)</option>
                                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Layout Section - Available for all components */}
                <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-900 mb-3">Layout & Spacing</h3>

                    {/* Width Control */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">Width</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['25%', '50%', '75%', '100%'].map((w) => (
                                <button
                                    key={w}
                                    onClick={() => handleChange('width', w)}
                                    className={`text-xs py-1.5 rounded border transition-colors ${(localProps.width || '100%') === w ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                >
                                    {w === '100%' ? 'Full' : w}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Margin Controls */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Margins (px)</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                                <label className="text-[10px] text-gray-500">Top</label>
                                <input
                                    type="number"
                                    className="w-full text-xs border border-gray-200 rounded p-1.5"
                                    value={localProps.marginTop ?? 0}
                                    placeholder="0"
                                    onChange={(e) => handleChange('marginTop', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500">Right</label>
                                <input
                                    type="number"
                                    className="w-full text-xs border border-gray-200 rounded p-1.5"
                                    value={localProps.marginRight ?? 0}
                                    placeholder="0"
                                    onChange={(e) => handleChange('marginRight', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500">Bottom</label>
                                <input
                                    type="number"
                                    className="w-full text-xs border border-gray-200 rounded p-1.5"
                                    value={localProps.marginBottom ?? 0}
                                    placeholder="0"
                                    onChange={(e) => handleChange('marginBottom', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500">Left</label>
                                <input
                                    type="number"
                                    className="w-full text-xs border border-gray-200 rounded p-1.5"
                                    value={localProps.marginLeft ?? 0}
                                    placeholder="0"
                                    onChange={(e) => handleChange('marginLeft', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Common ID field */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Hash size={12} />
                        <span className="text-[10px] font-mono">{selectedComponent.id}</span>
                    </div>
                </div>
            </div>
        </div >
    );
};
