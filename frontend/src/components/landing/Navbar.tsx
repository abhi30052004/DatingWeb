import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4 glass border-b border-white/10' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Heart className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold tracking-tight">PAIRLY</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#discover" className="text-sm font-medium hover:text-primary transition-colors">Discover</a>
          <Link to="/matches" className="text-sm font-medium hover:text-primary transition-colors">Matches</Link>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
          <a href="#safety" className="text-sm font-medium hover:text-primary transition-colors">Safety</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-white/80 transition-colors">
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-all"
          >
            Create Account
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#discover" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Discover</a>
            <Link to="/matches" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Matches</Link>
            <a href="#how-it-works" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#safety" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Safety</a>
            <hr className="border-white/10 my-2" />
            <Link to="/login" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            <Link
              to="/register"
              className="mt-2 text-center py-3 rounded-full bg-primary text-white font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Account
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
