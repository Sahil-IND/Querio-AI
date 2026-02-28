import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QueryInput from '../components/QueryInput';
import RouteBadge from '../components/RouteBadge';
import ExecutionTimeline from '../components/ExecutionTimeline';
import SqlPanel from '../components/SqlPanel';
import RagPanel from '../components/RagPanel';
import HybridPanel from '../components/HybridPanel';
import TransparencyPanel from '../components/TransparencyPanel';
import { queryUnified } from '../services/api';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleQuery = async (question) => {
    setLoading(true);
    setResponse(null);
    setActiveStep(1); // intent detection

    try {
      // Simulate step progression (backend doesn't give steps, so we animate)
      const stepInterval = setInterval(() => {
        setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 800);

      const data = await queryUnified(question);
      clearInterval(stepInterval);
      setActiveStep(4); // final step

      setResponse(data);
    } catch (error) {
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Intelligence Dashboard
        </h1>
        {response && <RouteBadge route={response.route} />}
      </div>

      <QueryInput onSubmit={handleQuery} loading={loading} />

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1">
            <ExecutionTimeline activeStep={activeStep} />
          </div>
          <div className="md:col-span-2 glass-card flex items-center justify-center h-64">
            <p className="text-gray-400">Processing your query...</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Dynamic panels based on route */}
            {response.route === 'SQL' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <ExecutionTimeline activeStep={2} />
                </div>
                <div className="md:col-span-2">
                  <SqlPanel data={response.raw_sql} />
                </div>
              </div>
            )}

            {response.route === 'DOCUMENTS' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <ExecutionTimeline activeStep={3} />
                </div>
                <div className="md:col-span-2">
                  <RagPanel data={response.raw_rag} />
                </div>
              </div>
            )}

            {response.route === 'HYBRID' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <ExecutionTimeline activeStep={4} />
                  </div>
                  <div className="md:col-span-2">
                    {/* Not needed, but we keep layout consistent */}
                  </div>
                </div>
                <HybridPanel
                  sqlData={response.raw_sql}
                  ragData={response.raw_rag}
                  executiveSummary={response.answer}
                />
              </>
            )}

            {/* Transparency panel always shown */}
            <TransparencyPanel
              route={response.route}
              rawSql={response.raw_sql}
              rawRag={response.raw_rag}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}