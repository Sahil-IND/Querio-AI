import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadPanel from '../components/UploadPanel';
import { 
  Cloud, 
  FileText, 
  CheckCircle, 
  Database, 
  HardDrive, 
  PieChart,
  Clock,
  TrendingUp,
  Archive,
  Lock,
  Zap,
  Layers
} from 'lucide-react';

export default function UploadPage() {
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const handleUploadSuccess = (result, filename, fileSize) => {
    setUploadedDocs(prev => [
      { 
        name: filename, 
        chunks: result.chunks, 
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        size: fileSize
      },
      ...prev.slice(0, 7)
    ]);
    setTotalChunks(prev => prev + result.chunks);
    setTotalSize(prev => prev + fileSize);
  };

  // Format bytes to human readable
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-200px)]">
      {/* Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        {/* Background decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
              <Cloud size={40} className="text-blue-400" />
            </div>
            Document Intelligence Hub
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-2xl">
            Upload your documents to enhance the knowledge base. 
            We support multiple formats and provide real-time indexing.
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { 
            icon: HardDrive, 
            label: 'Total Storage', 
            value: formatBytes(totalSize), 
            sub: 'Used',
            color: 'blue',
            gradient: 'from-blue-600/20 to-blue-800/20',
            border: 'border-blue-500/30'
          },
          { 
            icon: Layers, 
            label: 'Total Chunks', 
            value: totalChunks.toLocaleString(), 
            sub: 'Indexed',
            color: 'purple',
            gradient: 'from-purple-600/20 to-purple-800/20',
            border: 'border-purple-500/30'
          },
          { 
            icon: FileText, 
            label: 'Documents', 
            value: uploadedDocs.length, 
            sub: 'Uploaded',
            color: 'pink',
            gradient: 'from-pink-600/20 to-pink-800/20',
            border: 'border-pink-500/30'
          },
          { 
            icon: Zap, 
            label: 'Processing', 
            value: 'Real-time', 
            sub: 'Instant indexing',
            color: 'emerald',
            gradient: 'from-emerald-600/20 to-emerald-800/20',
            border: 'border-emerald-500/30'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 border ${stat.border} shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-${stat.color}-300/70 text-xs uppercase tracking-wider`}>{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-300 mt-1`}>{stat.value}</p>
                <p className={`text-xs text-${stat.color}-300/50 mt-1`}>{stat.sub}</p>
              </div>
              <div className={`p-2 bg-${stat.color}-500/20 rounded-lg`}>
                <stat.icon size={20} className={`text-${stat.color}-300`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Area (2/3 width) */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UploadPanel onUploadSuccess={handleUploadSuccess} />
          </motion.div>
        </div>

        {/* Right Column - Analytics & Recent Uploads (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-blue-400" />
              Storage Analytics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Storage Used</span>
                  <span className="text-blue-400 font-medium">{formatBytes(totalSize)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalSize / (100 * 1024 * 1024)) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Limit: 100 MB</p>
              </div>

              {/* <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 glass rounded-xl bg-blue-500/5">
                  <Clock size={16} className="mx-auto mb-1 text-blue-400" />
                  <div className="text-xs text-gray-400">Avg. Upload</div>
                  <div className="text-sm font-semibold text-blue-300">1.2s</div>
                </div>
                <div className="text-center p-3 glass rounded-xl bg-purple-500/5">
                  <TrendingUp size={16} className="mx-auto mb-1 text-purple-400" />
                  <div className="text-xs text-gray-400">Success Rate</div>
                  <div className="text-sm font-semibold text-purple-300">98%</div>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* Recent Uploads Timeline */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-purple-400" />
              Recent Uploads
            </h3>
            
            {uploadedDocs.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {uploadedDocs.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300" />
                    <div className="relative flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/5 transition-all duration-300">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                        <FileText size={16} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-gray-200">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-500/10 rounded-full text-blue-300">
                            {doc.chunks} chunks
                          </span>
                          <span className="text-xs text-gray-500">{doc.time}</span>
                        </div>
                      </div>
                      <CheckCircle size={16} className="text-emerald-400 mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="relative">
                  <FileText size={48} className="mx-auto text-gray-600 mb-3" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500/5 rounded-full blur-xl"
                  />
                </div>
                <p className="text-gray-400">No uploads yet</p>
                <p className="text-xs text-gray-600 mt-1">Your uploaded files will appear here</p>
              </div>
            )}
          </motion.div> */}

          {/* Supported Formats & Security */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/20"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Archive size={16} className="text-emerald-400" />
                  Supported Formats
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { ext: '.txt', color: 'blue' },
                    { ext: '.pdf', color: 'purple' },
                    { ext: '.docx', color: 'pink' },
                    { ext: '.md', color: 'emerald' },
                  ].map((format) => (
                    <motion.span
                      key={format.ext}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`px-3 py-1.5 bg-${format.color}-500/10 rounded-lg text-xs text-${format.color}-300 border border-${format.color}-500/20 font-medium`}
                    >
                      {format.ext}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Lock size={16} className="text-purple-400" />
                  Security Features
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={12} className="text-emerald-400" />
                    End-to-end encryption
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={12} className="text-emerald-400" />
                    Automatic virus scanning
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={12} className="text-emerald-400" />
                    Secure cloud storage
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}