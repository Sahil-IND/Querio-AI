import { Clock } from 'lucide-react';

export default function QueryHistory({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No queries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item)}
          className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition group"
        >
          <p className="text-sm text-gray-300 line-clamp-1">{item.question}</p>
          <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
        </button>
      ))}
    </div>
  );
}