import { motion } from 'framer-motion';

const routeColors = {
  SQL: 'from-purple-500 to-pink-500',
  DOCUMENTS: 'from-green-500 to-teal-500',
  HYBRID: 'from-blue-500 to-indigo-500',
};

export default function RouteBadge({ route }) {
  if (!route) return null;
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${routeColors[route]} text-white text-sm font-medium shadow-lg`}
    >
      {route}
    </motion.div>
  );
}