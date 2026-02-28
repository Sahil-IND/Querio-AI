import { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function QueryInput({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      onSubmit(question);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Sparkles size={18} className="text-blue-400" />
        </div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your data or documents..."
          className="w-full bg-transparent border-none outline-none pl-12 pr-24 py-4 text-gray-100 placeholder-gray-600 text-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Processing</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Ask</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}