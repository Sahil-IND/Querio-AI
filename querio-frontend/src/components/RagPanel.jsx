import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function RagPanel({ data }) {
  if (!data) return null;

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-2">Document Insights</h3>
      <p className="text-gray-300 mb-4">{data.answer}</p>

      {data.sources && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Sources</h4>
          <div className="space-y-2">
            {data.sources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-black/30 rounded-xl"
              >
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-blue-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{source.filename}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Relevance: {source.relevance_score?.toFixed(2)} • Chunk {source.chunk_index}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{source.preview}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}