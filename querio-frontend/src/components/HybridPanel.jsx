import { motion } from 'framer-motion';
import SqlPanel from './SqlPanel';
import RagPanel from './RagPanel';

export default function HybridPanel({ sqlData, ragData, executiveSummary }) {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30"
      >
        <h3 className="text-lg font-semibold mb-2">Executive Intelligence Summary</h3>
        <p className="text-gray-100 text-lg leading-relaxed">{executiveSummary}</p>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SqlPanel data={sqlData} />
        <RagPanel data={ragData} />
      </div>
    </div>
  );
}