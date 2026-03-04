"use client";

import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";

const MAX_ROWS = 10_000;

export interface DatasetUploadResult {
  columnName: string;
  values: number[];
}

interface Props {
  onDatasetReady: (result: DatasetUploadResult) => void;
}

/**
 * CSV dataset upload component.
 *
 * Users can upload CSV files containing numeric columns.  The file is parsed
 * entirely client-side (PapaParse) and **never** sent to a server.
 *
 * Flow: Upload CSV → choose column → dataset preview → accept.
 */
export default function DatasetUpload({ onDatasetReady }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [selectedCol, setSelectedCol] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<number[] | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setColumns([]);
    setRows([]);
    setSelectedCol("");
    setPreview(null);

    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          setError(`CSV parse error: ${results.errors[0].message}`);
          return;
        }
        const data = results.data;
        if (data.length === 0) {
          setError("CSV file is empty.");
          return;
        }
        if (data.length > MAX_ROWS) {
          setError(`Dataset too large (${data.length} rows). Maximum is ${MAX_ROWS}.`);
          return;
        }
        const cols = Object.keys(data[0]);
        if (cols.length === 0) {
          setError("No columns found in CSV.");
          return;
        }
        setColumns(cols);
        setRows(data);
      },
    });
  }, []);

  const handleColumnSelect = useCallback(
    (col: string) => {
      setSelectedCol(col);
      setError(null);
      const nums = rows.map((r) => Number(r[col]));
      const hasNaN = nums.some((v) => Number.isNaN(v));
      if (hasNaN) {
        setError(`Column "${col}" contains non-numeric values.`);
        setPreview(null);
        return;
      }
      setPreview(nums);
    },
    [rows],
  );

  const handleAccept = useCallback(() => {
    if (!preview || !selectedCol) return;
    onDatasetReady({ columnName: selectedCol, values: preview });
  }, [preview, selectedCol, onDatasetReady]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Upload CSV Dataset
        </label>
        <p className="text-xs text-gray-500 mb-2">
          CSV files with numeric columns only. Data stays in your browser — nothing is sent to any server.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">{error}</p>
      )}

      {columns.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Select Column to Analyze
          </label>
          <select
            value={selectedCol}
            onChange={(e) => handleColumnSelect(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">— choose a column —</option>
            {columns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">{rows.length} rows loaded</p>
        </div>
      )}

      {preview && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Preview (first 10 values)</h4>
          <div className="flex flex-wrap gap-2">
            {preview.slice(0, 10).map((v, i) => (
              <span
                key={i}
                className="bg-gray-800 text-indigo-300 text-xs font-mono px-2 py-1 rounded"
              >
                {v}
              </span>
            ))}
            {preview.length > 10 && (
              <span className="text-xs text-gray-500">…and {preview.length - 10} more</span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            n = {preview.length}, range = [{Math.min(...preview).toFixed(2)}, {Math.max(...preview).toFixed(2)}]
          </p>

          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded transition-colors"
          >
            Use This Dataset
          </button>
        </div>
      )}
    </div>
  );
}
