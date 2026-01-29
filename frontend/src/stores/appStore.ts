import { create } from 'zustand';

export type ComponentType = 'text' | 'button' | 'image' | 'container' | 'product_grid' | 'chart' | 'slider' | 'bottom_nav' | 'video' | 'webview' | 'spacer' | 'product_detail' | 'toolbar' | 'news_grid' | 'news_detail';

export interface AppComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: AppComponent[]; // for containers
}

export interface AppScreen {
  id: string;
  name: string;
  components: AppComponent[];
}

interface AppState {
  screens: AppScreen[];
  activeScreenId: string;
  selectedId: string | null;
  isPreviewMode: boolean;

  // Actions
  addScreen: (name: string) => void;
  setActiveScreen: (id: string) => void;
  setPreviewMode: (enabled: boolean) => void;

  addComponent: (component: AppComponent) => void;
  selectComponent: (id: string | null) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  removeComponent: (id: string) => void;

  reorderComponents: (components: AppComponent[]) => void;
  loadTemplate: (screens: AppScreen[]) => void;
}

// Robust ID Generator
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

import initialState from './initialState.json';

export const useAppStore = create<AppState>((set, get) => ({
  screens: initialState as AppScreen[],
  activeScreenId: 'screen-home',
  selectedId: null,
  isPreviewMode: false,

  setPreviewMode: (enabled) => set({ isPreviewMode: enabled, selectedId: null }),

  addScreen: (name) => set((state) => {
    const newId = `screen-${generateId()}`;
    return {
      screens: [...state.screens, { id: newId, name, components: [] }],
      activeScreenId: newId,
      selectedId: null
    };
  }),

  setActiveScreen: (id) => set({ activeScreenId: id, selectedId: null }),

  addComponent: (c) => set((state) => ({
    screens: state.screens.map(s =>
      s.id === state.activeScreenId
        ? { ...s, components: [...s.components, c] }
        : s
    )
  })),

  selectComponent: (id) => set({ selectedId: id }),

  updateComponent: (id, props) => set((state) => ({
    screens: state.screens.map(s =>
      s.id === state.activeScreenId
        ? { ...s, components: s.components.map((c) => c.id === id ? { ...c, props: { ...c.props, ...props } } : c) }
        : s
    )
  })),

  removeComponent: (id) => set((state) => ({
    screens: state.screens.map(s =>
      s.id === state.activeScreenId
        ? { ...s, components: s.components.filter((c) => c.id !== id) }
        : s
    )
  })),
  reorderComponents: (components) => set((state) => ({
    screens: state.screens.map(s =>
      s.id === state.activeScreenId
        ? { ...s, components }
        : s
    )
  })),

  loadTemplate: (newScreens) => set({
    screens: newScreens,
    activeScreenId: newScreens.length > 0 ? newScreens[0].id : 'screen-home',
    selectedId: null
  })
}));
