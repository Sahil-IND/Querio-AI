import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QueryInput from '../components/QueryInput';
import RouteBadge from '../components/RouteBadge';
import ExecutionTimeline from '../components/ExecutionTimeline';
import TransparencyPanel from '../components/TransparencyPanel';
import QueryHistory from '../components/QueryHistory';
import { queryUnified } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  History, 
  X, 
  Sparkles, 
  Zap, 
  Brain, 
  Database, 
  Clock, 
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function QueryPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(true);

  const handleQuery = async (question) => {
    setLoading(true);
    setResponse(null);
    setActiveStep(1);

    try {
      const stepInterval = setInterval(() => {
        setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 800);

      const data = await queryUnified(question);
      clearInterval(stepInterval);
      setActiveStep(0);
      
      setResponse(data);
      
      setQueryHistory(prev => [
        { 
          question, 
          timestamp: new Date().toLocaleTimeString(), 
          response: data 
        },
        ...prev.slice(0, 4)
      ]);
      
    } catch (error) {
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setResponse(item.response);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Brain className="text-blue-400" size={32} />
              Intelligence Hub
            </h1>
            <p className="text-gray-400 mt-1">Ask anything about your data and documents</p>
          </div>
          {/* <button
            onClick={() => setShowHistory(!showHistory)}
            className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/5 transition-all duration-200 group border border-white/10 hover:border-blue-500/30"
          >
            <History size={18} className="group-hover:text-blue-400 transition-colors" />
            <span className="group-hover:text-blue-400 transition-colors">History</span>
          </button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-xl p-4 flex items-center gap-3 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap size={20} className="text-blue-300" />
            </div>
            <div>
              <p className="text-xs text-blue-300/70">Response Time</p>
              <p className="text-lg font-bold text-blue-300">&lt;500ms</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-xl p-4 flex items-center gap-3 border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5"
          >
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Cpu size={20} className="text-purple-300" />
            </div>
            <div>
              <p className="text-xs text-purple-300/70">AI Model</p>
              <p className="text-lg font-bold text-purple-300">Gemma2 9B</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-xl p-4 flex items-center gap-3 border border-emerald-500/20 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Database size={20} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-emerald-300/70">Documents</p>
              <p className="text-lg font-bold text-emerald-300">Indexed</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1"
            >
              <div className="glass-card sticky top-24 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <History size={16} className="text-blue-400" />
                    Recent Queries
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="lg:hidden p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <QueryHistory history={queryHistory} onSelect={loadFromHistory} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Column - Main Content */}
        <div className={showHistory ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {/* Query Input */}
          <div className="mb-8">
            <div className="glass p-1 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <QueryInput onSubmit={handleQuery} loading={loading} />
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 rounded-full text-xs text-blue-300 border border-blue-500/20">
                <Sparkles size={12} className="text-blue-400" />
                Try: "How many customers?"
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 rounded-full text-xs text-purple-300 border border-purple-500/20">
                <Sparkles size={12} className="text-purple-400" />
                Try: "Explain refund policy"
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 bg-pink-500/10 rounded-full text-xs text-pink-300 border border-pink-500/20">
                <Sparkles size={12} className="text-pink-400" />
                Try: "Hybrid question"
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card relative overflow-hidden bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse-slow" />
              <ExecutionTimeline activeStep={activeStep} />
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence>
            {response && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <RouteBadge route={response.route} />
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} className="text-blue-400" />
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Results ready
                  </motion.div>
                </div>

                {/* Executive Summary - Collapsible */}
                {response.answer && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-blue-500/20"
                  >
                    <button
                      onClick={() => setShowExecutiveSummary(!showExecutiveSummary)}
                      className="w-full flex items-center justify-between"
                    >
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Brain size={18} className="text-blue-400" />
                        Executive Summary
                      </h2>
                      {showExecutiveSummary ? 
                        <ChevronUp size={18} className="text-gray-400" /> : 
                        <ChevronDown size={18} className="text-gray-400" />
                      }
                    </button>
                    
                    <AnimatePresence>
                      {showExecutiveSummary && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-200 leading-relaxed mt-4 text-lg">
                            {response.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* AI Engine Details - Main Panel */}
                <TransparencyPanel
                  route={response.route}
                  rawSql={response.raw_sql}
                  rawRag={response.raw_rag}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!response && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card text-center py-16 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/10"
            >
              <Brain size={48} className="mx-auto mb-4 text-blue-400/30" />
              <h3 className="text-xl font-semibold mb-2 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Ready to explore your data?
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Ask a question above to get insights from your SQL database and documents
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <span className="px-3 py-1.5 bg-blue-500/10 rounded-full text-xs text-blue-300 border border-blue-500/20">
                  📊 SQL Queries
                </span>
                <span className="px-3 py-1.5 bg-purple-500/10 rounded-full text-xs text-purple-300 border border-purple-500/20">
                  📄 Document Search
                </span>
                <span className="px-3 py-1.5 bg-pink-500/10 rounded-full text-xs text-pink-300 border border-pink-500/20">
                  🔄 Hybrid Intelligence
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}