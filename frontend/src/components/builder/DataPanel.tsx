import React, { useState } from 'react';
import { Database, Link, CheckCircle, AlertCircle } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';

export const DataPanel = () => {
    const { sheetId, setSheetId, fetchData, data, columns, isLoading } = useDataStore();
    const [localId, setLocalId] = useState(sheetId);

    const handleConnect = () => {
        setSheetId(localId);
        fetchData();
    };

    return (
        <div className="w-64 bg-white border-l border-gray-200 p-4 h-full flex flex-col overflow-y-auto">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                <Database size={16} /> Data Source
            </h2>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Google Sheet ID</label>
                <div className="flex gap-1">
                    <input
                        className="w-full text-xs border border-gray-300 rounded p-1.5 focus:border-blue-500 outline-none"
                        placeholder="e.g. 1BxiMvs..."
                        value={localId}
                        onChange={(e) => setLocalId(e.target.value)}
                    />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                    Enter "DEMO" for testing. Ensure your sheet is "Published to Web".
                </p>

                <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="mt-2 w-full bg-blue-50 text-blue-600 border border-blue-200 py-1.5 rounded text-xs font-semibold hover:bg-blue-100 flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Connecting...' : 'Connect Sheet'} <Link size={12} />
                </button>
            </div>

            {data.length > 0 && (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle size={14} />
                        <span className="text-xs font-medium">Connected ({data.length} rows)</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-500 mb-1">Available Columns:</div>
                    <div className="flex flex-wrap gap-1 mb-4">
                        {columns.map(col => (
                            <span key={col} className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600 border">
                                {col}
                            </span>
                        ))}
                    </div>

                    <div className="text-xs font-semibold text-gray-500 mb-1">Preview Data:</div>
                    <div className="flex-1 border rounded bg-gray-50 overflow-auto p-2">
                        <pre className="text-[10px] text-gray-600 font-mono">
                            {JSON.stringify(data.slice(0, 2), null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {data.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Database size={24} className="mb-2 opacity-20" />
                    <span className="text-xs text-center">No data connected</span>
                </div>
            )}
        </div>
    );
};
