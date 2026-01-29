'use client';
import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Sidebar } from '@/components/builder/Sidebar';
import { Canvas } from '@/components/builder/Canvas';
import { PropertyPanel } from '@/components/builder/PropertyPanel';
import { useAppStore, AppComponent } from '@/stores/appStore';
import { ecommerceTemplate } from '@/stores/templates';
import { arrayMove } from '@dnd-kit/sortable';
import { DataPanel } from '@/components/builder/DataPanel';
import { useDataStore } from '@/stores/dataStore'; // Import DataStore

import { Capacitor } from '@capacitor/core';

export default function BuilderPage() {
  const { screens, activeScreenId, addComponent, reorderComponents, selectedId, selectComponent, addScreen, setActiveScreen, isPreviewMode, setPreviewMode, loadTemplate } = useAppStore();
  const { fetchData } = useDataStore(); // Use DataStore hook
  const components = screens.find(s => s.id === activeScreenId)?.components || [];

  const [isMounted, setIsMounted] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchData(); // Auto-fetch on mount
    if (Capacitor.isNativePlatform()) {
      setIsNative(true);
      setPreviewMode(true);
    }
  }, [setPreviewMode, fetchData]);

  // Robust ID Generator (Fallbacks for non-secure contexts)
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ... (handleExport definition)

  const handleExport = () => {
    // ... (keep existing logic)
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ screens }, null, 2));
    // ...
  };

  // Keyboard Shortcuts ...
  useEffect(() => {
    // ... (keep existing handleKeyDown)
    const handleKeyDown = (e: KeyboardEvent) => {
      // ... (keep existing logic)
    };
    // ...
    const activeElementCb = () => document.activeElement?.tagName;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, copiedId, components, addComponent, selectComponent]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (!isMounted) return null; // Prevent hydration mismatch

  // If running as a Native App, show ONLY the Canvas (App View)
  if (isNative) {
    return (
      <div className="w-full h-screen bg-white">
        <Canvas isNative={true} />
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // ... (keep existing logic)
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.isSidebar) {
      if (over.id === 'canvas-droppable' || components.some(c => c.id === over.id)) {
        const type = active.data.current?.type;
        if (type) {
          addComponent({
            id: generateId(),
            type,
            props: {},
          });
        }
      }
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderComponents(arrayMove(components, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50 text-slate-900">
        {/* Page Selector */}
        <div className="h-12 bg-white border-b flex items-center px-4 gap-2">
          {/* ... (keep existing Top Bar) */}
          <span className="text-xs font-bold text-gray-500 uppercase mr-2">Screens:</span>
          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveScreen(s.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${activeScreenId === s.id ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              {s.name}
            </button>
          ))}
          <button
            onClick={() => {
              const name = prompt("Screen Name?");
              if (name) addScreen(name);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 ml-2"
            title="Add New Screen"
          >
            +
          </button>

          <button
            onClick={() => {
              if (confirm("Load 'Toko Online' Template? This will replace your current work.")) {
                loadTemplate(ecommerceTemplate);
              }
            }}
            className="ml-3 px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full border border-indigo-200 hover:bg-indigo-100"
          >
            ✨ Load Template
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-0.5 rounded-lg border">
              <button
                onClick={() => setPreviewMode(false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!isPreviewMode ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Edit
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${isPreviewMode ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={() => {
                alert(
                  "✅ Project Ready for Android Build!\n\n" +
                  "1. Open Terminal in VS Code.\n" +
                  "2. Run: npx cap open android\n" +
                  "3. Android Studio will open.\n" +
                  "4. Click 'Build > Build Bundles/APKs > Build APK'.\n\n" +
                  "Note: This button currently just exports the JSON config as a backup."
                );
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ screens }, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "app_schema.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="ml-4 px-4 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>🚀 Build APK</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertyPanel />
          <DataPanel />
        </div>
      </div>
    </DndContext>
  );
}
