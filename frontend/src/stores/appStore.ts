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

export const useAppStore = create<AppState>((set, get) => ({
  screens: [
    {
      "id": "screen-home",
      "name": "Home",
      "components": [
        {
          "id": "mfas11fu5uact7n9v9optq",
          "type": "image",
          "props": {
            "src": "https://lelogama.go-jek.com/post_featured_image/Gojek_KV-GOKANTOR-NON-PROMO_1456x818.jpg"
          }
        },
        {
          "id": "2qr991cu60tahw7ljjaek",
          "type": "product_grid",
          "props": {
            "bind_image": "Image",
            "bind_title": "Title",
            "bind_subtitle": "Price",
            "itemActionType": "navigate",
            "itemTargetScreenId": "screen-kg4wjodkwjdboashsp2p0r"
          }
        }
      ]
    },
    {
      "id": "screen-kg4wjodkwjdboashsp2p0r",
      "name": "page",
      "components": [
        {
          "id": "9kygpvyhtb8q37m0skuua8",
          "type": "toolbar",
          "props": {
            "title": "detail"
          }
        },
        {
          "id": "dqd93uka0ehxp79cjv91mc",
          "type": "product_detail",
          "props": {
            "dataBind_title": "Title",
            "dataBind_price": "Price",
            "dataBind_description": "Description",
            "dataBind_image": "Image",
            "whatsappNumber": "6282246197193"
          }
        }
      ]
    }
  ],
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
