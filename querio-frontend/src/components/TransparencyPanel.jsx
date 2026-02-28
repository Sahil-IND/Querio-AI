import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye, Code, Database, FileText } from 'lucide-react';

export default function TransparencyPanel({ route, rawSql, rawRag }) {
  const [open, setOpen] = useState(false);

  if (!route) return null;

  const formatSQLResult = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-400">
          <Database size={16} />
          <span className="font-medium">Generated SQL</span>
        </div>
        <pre className="bg-black/40 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-blue-500/20">
          {data.sql}
        </pre>
        <div className="flex items-center gap-2 text-green-400">
          <Code size={16} />
          <span className="font-medium">Results ({data.row_count} rows)</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl overflow-x-auto border border-green-500/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {data.results && data.results[0] && Object.keys(data.results[0]).map(key => (
                  <th key={key} className="text-left py-2 px-3 text-gray-400">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.results && data.results.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="py-2 px-3">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const formatRAGResult = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-400">
          <FileText size={16} />
          <span className="font-medium">RAG Response</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20">
          <p className="text-gray-300">{data.answer}</p>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-400">Sources ({data.sources?.length || 0})</span>
          {data.sources?.map((source, idx) => (
            <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 text-sm">
                <FileText size={14} className="text-blue-400" />
                <span className="font-medium">{source.filename}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  Score: {source.relevance_score?.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{source.preview}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card mt-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition">
            <Eye size={18} className="text-blue-400" />
          </div>
          <span className="font-semibold">AI Engine Details</span>
          <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400">
            {route}
          </span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6">
              {rawSql && formatSQLResult(rawSql)}
              {rawRag && formatRAGResult(rawRag)}
              {!rawSql && !rawRag && (
                <p className="text-gray-500 text-center py-4">No detailed data available</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}