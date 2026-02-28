import { motion } from 'framer-motion';
import { Book, Code, FileText, HelpCircle, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      links: ['Quick Start Guide', 'API Keys', 'Authentication', 'Rate Limits'],
      color: 'blue',
    },
    {
      title: 'API Reference',
      icon: Code,
      links: ['Query Endpoint', 'Upload Endpoint', 'Health Check', 'Error Handling'],
      color: 'purple',
    },
    {
      title: 'Guides',
      icon: FileText,
      links: ['SQL Queries', 'Document RAG', 'Hybrid Queries', 'Best Practices'],
      color: 'green',
    },
    {
      title: 'Support',
      icon: HelpCircle,
      links: ['FAQ', 'Troubleshooting', 'Contact Us', 'Community'],
      color: 'pink',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
          <Book size={36} className="text-blue-400" />
          Documentation
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Everything you need to integrate Querio into your workflow
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full glass rounded-xl py-4 pl-12 pr-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </motion.div>

      {/* Documentation Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="glass-card"
          >
            <div className={`flex items-center gap-3 mb-4`}>
              <div className={`p-2 bg-${section.color}-500/20 rounded-lg`}>
                <section.icon className={`text-${section.color}-400`} size={24} />
              </div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.links.map((link, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="text-gray-400 group-hover:text-blue-400 transition">{link}</span>
                  <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400 transition" />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card text-center py-8"
      >
        <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
        <div className="flex justify-center gap-4">
          <Link to="/pricing" className="text-blue-400 hover:text-blue-300 transition">
            Check Pricing →
          </Link>
          <Link to="/query" className="text-purple-400 hover:text-purple-300 transition">
            Try Intelligence Hub →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}