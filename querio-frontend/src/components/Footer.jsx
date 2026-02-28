import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-blue-400" size={24} />
              <span className="text-lg font-bold">Querio</span>
            </div>
            <p className="text-sm text-gray-400">
              Intelligent Answers from Your Data and Documents
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-blue-400">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <motion.li whileHover={{ x: 5 }}><Link to="/" className="hover:text-blue-400 transition">Home</Link></motion.li>
              <motion.li whileHover={{ x: 5 }}><Link to="/query" className="hover:text-blue-400 transition">Intelligence Hub</Link></motion.li>
              <motion.li whileHover={{ x: 5 }}><Link to="/upload" className="hover:text-blue-400 transition">Upload</Link></motion.li>
              
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-purple-400">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <motion.li whileHover={{ x: 5 }}><Link to="/docs" className="hover:text-purple-400 transition">Documentation</Link></motion.li>
              <motion.li whileHover={{ x: 5 }}><a href="#" className="hover:text-purple-400 transition">API Reference</a></motion.li>
              <motion.li whileHover={{ x: 5 }}><Link to="/pricing" className="hover:text-blue-400 transition">Pricing</Link></motion.li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-pink-400">Connect</h4>
            <div className="flex gap-3 mb-4">
              {[
                { icon: Github, color: 'blue' },
                { icon: Twitter, color: 'purple' },
                { icon: Linkedin, color: 'pink' },
                { icon: Youtube, color: 'red' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`p-2 glass rounded-lg hover:bg-${social.color}-500/20 transition`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={14} className="text-blue-400" />
              <span>support@querio.ai</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Querio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-400 transition">Terms</a>
              <a href="#" className="hover:text-blue-400 transition">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}