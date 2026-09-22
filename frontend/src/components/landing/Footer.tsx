
import { Heart, Globe, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">PAIRLY</span>
            </Link>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Meet someone who matches your vibe. Discover meaningful connections.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <Mail size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-6">Links</h5>
              <ul className="space-y-4">
                <li><a href="#discover" className="text-white/60 hover:text-white text-sm transition">Discover</a></li>
                <li><a href="#matches" className="text-white/60 hover:text-white text-sm transition">Matches</a></li>
                <li><a href="#messages" className="text-white/60 hover:text-white text-sm transition">Messages</a></li>
                <li><a href="#safety" className="text-white/60 hover:text-white text-sm transition">Safety</a></li>
                <li><a href="#about" className="text-white/60 hover:text-white text-sm transition">About</a></li>
                <li><a href="#contact" className="text-white/60 hover:text-white text-sm transition">Contact</a></li>
                <li><a href="#privacy" className="text-white/60 hover:text-white text-sm transition">Privacy</a></li>
                <li><a href="#terms" className="text-white/60 hover:text-white text-sm transition">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Pairly. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
