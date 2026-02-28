import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadPanel({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('File type not supported');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setError(null);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadDocument(files[0]);
      setUploaded(result);
      if (onUploadSuccess) {
        onUploadSuccess(result, files[0].name, files[0].size);
      }
      setFiles([]);
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFiles([]);
    setError(null);
  };

  return (
    <div className="glass-card bg-gradient-to-br from-blue-600/5 to-purple-600/5 border-2 border-blue-500/20">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
          <Upload className="text-blue-400" size={24} />
        </div>
        Upload New Document
      </h2>

      {/* Dropzone */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...getRootProps()}
        className={`
          relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-gradient-to-br from-blue-600/20 to-purple-600/20 scale-105' 
            : 'border-white/20 hover:border-blue-400 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {/* Animated background */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"
        />
        
        <div className="relative z-10">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Upload className="mx-auto h-20 w-20 text-blue-400/30 mb-4" />
          </motion.div>
          
          {isDragActive ? (
            <p className="text-blue-400 text-lg font-semibold">Drop the file here ...</p>
          ) : (
            <>
              <p className="text-gray-300 text-lg mb-2 font-medium">Drag & drop a file here</p>
              <p className="text-gray-500 text-sm">or click to browse</p>
            </>
          )}
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400"
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected File Preview */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 glass rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <File size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">{files[0].name}</p>
                  <p className="text-xs text-gray-500">
                    {(files[0].size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                disabled={uploading}
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Upload Document</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Success */}
      <AnimatePresence>
        {uploaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 glass rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-full">
                <CheckCircle className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-emerald-300">Upload successful!</p>
                <p className="text-sm text-gray-400">{uploaded.chunks} chunks indexed and ready for querying</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick tips */}
      <div className="mt-6 text-xs text-gray-500 flex items-center gap-4">
        <span className="flex items-center gap-1">
          <CheckCircle size={12} className="text-emerald-400" />
          Max file size: 10MB
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle size={12} className="text-emerald-400" />
          Instant indexing
        </span>
      </div>
    </div>
  );
}