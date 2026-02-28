import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SqlPanel({ data }) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">SQL Result</h3>
        <span className="text-sm text-gray-400">{data.row_count} rows</span>
      </div>

      {data.results && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {Object.keys(data.results[0] || {}).map((key) => (
                  <th key={key} className="text-left py-2 px-3 font-medium text-gray-400">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.results.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="py-2 px-3">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          Raw SQL
        </button>
        {expanded && (
          <div className="mt-2 p-3 bg-black/30 rounded-xl font-mono text-sm relative">
            <button
              onClick={() => copyToClipboard(data.sql)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
            >
              <Copy size={14} />
            </button>
            <pre className="overflow-x-auto">{data.sql}</pre>
          </div>
        )}
      </div>
    </div>
  );
}