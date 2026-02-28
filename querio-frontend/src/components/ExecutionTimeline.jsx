import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

const steps = [
  { id: 1, label: 'Intent Detection' },
  { id: 2, label: 'SQL Execution' },
  { id: 3, label: 'Document Retrieval' },
  { id: 4, label: 'AI Fusion' },
];

export default function ExecutionTimeline({ activeStep }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Execution Timeline</h3>
      <div className="relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 mb-4 last:mb-0"
          >
            <div className="relative">
              {activeStep > step.id ? (
                <CheckCircle className="text-green-400" size={24} />
              ) : activeStep === step.id ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Circle className="text-blue-400" size={24} />
                </motion.div>
              ) : (
                <Circle className="text-gray-600" size={24} />
              )}
            </div>
            <div>
              <p className={`font-medium ${activeStep >= step.id ? 'text-gray-100' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {activeStep === step.id && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-blue-400"
                >
                  Processing...
                </motion.p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}