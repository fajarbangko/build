import { create } from 'zustand';

export interface DataRow {
    [key: string]: string | number;
}

interface DataState {
    sheetId: string;
    sheetName: string;
    data: DataRow[];
    columns: string[];
    selectedRow: DataRow | null;
    isLoading: boolean;

    setSheetId: (id: string) => void;
    setSelectedRow: (row: DataRow | null) => void;
    fetchData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
    sheetId: '1YuwTSEj1jF7_Nv4onJFC02sPdP7ihee_e_8sp20w74A',
    sheetName: 'Sheet1',
    data: [],
    columns: [],
    selectedRow: null,
    isLoading: false,

    setSelectedRow: (row) => set({ selectedRow: row }),
    setSheetId: (id) => set({ sheetId: id }),

    fetchData: async () => {
        let { sheetId } = get();
        const { sheetName } = get();
        if (!sheetId) return;

        // Auto-extract ID if full URL is pasted
        if (sheetId.includes('docs.google.com')) {
            // Check for Published URL (docs.google.com/spreadsheets/d/e/...)
            if (sheetId.includes('/d/e/')) {
                alert("⚠️ Anda menggunakan Link Publish (/d/e/).\nMohon gunakan Link Edit dari browser (biasanya diawali '1...').\nContoh: docs.google.com/spreadsheets/d/1Bxi.../edit");
                set({ isLoading: false });
                return;
            }

            // Extract standard ID
            const matches = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (matches && matches[1]) {
                sheetId = matches[1];
                set({ sheetId });
            }
        }

        set({ isLoading: true });

        // SIMULATION MODE: 
        // Real fetching often faces CORS issues on localhost without a proxy.
        // We will simulate a successful fetch if the user enters "DEMO" or real fetch if possible.

        if (sheetId === 'DEMO') {
            setTimeout(() => {
                set({
                    columns: ['Title', 'Image', 'Price', 'Description'],
                    data: [
                        { Title: 'Sepatu Nike', Image: 'https://placehold.co/400x400/png?text=Shoe', Price: 'Rp 500.000', Description: 'Sepatu lari nyaman' },
                        { Title: 'Baju Adidas', Image: 'https://placehold.co/400x400/png?text=Shirt', Price: 'Rp 200.000', Description: 'Baju olahraga' },
                        { Title: 'Topi Puma', Image: 'https://placehold.co/400x400/png?text=Hat', Price: 'Rp 100.000', Description: 'Topi santai' },
                    ],
                    isLoading: false
                });
            }, 1000);
            return;
        }

        try {
            // Attempt real fetch using Google Visualization API (often works for public sheets)
            // https://docs.google.com/spreadsheets/d/{sheetId}/gviz/tq?tqx=out:json
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
            const response = await fetch(url);
            const text = await response.text();

            // The API returns "/*O_o*/ google.visualization.Query.setResponse({...});"
            // We need to parse just the JSON object.
            const jsonString = text.substring(47).slice(0, -2);
            const json = JSON.parse(jsonString);

            // Parse cols
            const cols = json.table.cols.map((c: any) => c.label);

            // Parse rows
            const rows = json.table.rows.map((r: any) => {
                const rowObj: DataRow = {};
                r.c.forEach((cell: any, index: number) => {
                    rowObj[cols[index]] = cell ? (cell.v || cell.f) : '';
                });
                return rowObj;
            });

            set({ columns: cols, data: rows, isLoading: false });

        } catch (error) {
            console.error("Failed to fetch sheet", error);
            // Fallback for demonstration if fetch fails (likely CORS)
            alert("Gagal mengambil data Real (CORS Restriction). Menggunakan Data Mock.");
            set({
                columns: ['Title', 'Image', 'Price'],
                data: [
                    { Title: 'Item 1', Image: '', Price: '100' },
                    { Title: 'Item 2', Image: '', Price: '200' },
                ],
                isLoading: false
            });
        }
    }
}));
