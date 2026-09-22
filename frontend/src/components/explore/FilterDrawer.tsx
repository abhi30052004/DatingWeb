import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const [ageRange, setAgeRange] = React.useState([22, 30]);
  const [distance, setDistance] = React.useState(25);
  const [interestedIn, setInterestedIn] = React.useState('everyone');
  const [goal, setGoal] = React.useState('casual');
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [onlineOnly, setOnlineOnly] = React.useState(false);
  
  const interests = ['Travel', 'Music', 'Movies', 'Food', 'Photography', 'Fitness', 'Books', 'Gaming', 'Technology', 'Art'];
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const resetFilters = () => {
    setAgeRange([18, 99]);
    setDistance(50);
    setInterestedIn('everyone');
    setGoal('');
    setVerifiedOnly(false);
    setOnlineOnly(false);
    setSelectedInterests([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[400px] h-full bg-surface border-l border-slate-800 z-50 flex flex-col shadow-2xl overflow-y-auto pb-safe"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-surface/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-primary" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-8">
              
              {/* Age */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Age Range</h3>
                  <span className="text-sm font-bold text-primary">{ageRange[0]} - {ageRange[1]}</span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min="18" max="99" 
                    value={ageRange[0]} 
                    onChange={e => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-center text-white focus:border-primary"
                  />
                  <span className="text-gray-500">to</span>
                  <input 
                    type="number" 
                    min="18" max="99" 
                    value={ageRange[1]} 
                    onChange={e => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-center text-white focus:border-primary"
                  />
                </div>
              </section>

              {/* Distance */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Maximum Distance</h3>
                  <span className="text-sm font-bold text-primary">{distance} km</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={distance} 
                  onChange={e => setDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </section>

              {/* Interested In */}
              <section>
                <h3 className="font-semibold text-white mb-4">Interested in</h3>
                <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
                  {['men', 'women', 'everyone'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setInterestedIn(opt)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${interestedIn === opt ? 'bg-slate-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </section>

              {/* Relationship Goal */}
              <section>
                <h3 className="font-semibold text-white mb-4">Relationship Goal</h3>
                <select 
                  value={goal} 
                  onChange={e => setGoal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-primary appearance-none"
                >
                  <option value="">Any</option>
                  <option value="Long-term relationship">Long-term relationship</option>
                  <option value="Casual dating">Casual dating</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </section>

              {/* Toggles */}
              <section className="space-y-4">
                <label className="flex justify-between items-center p-4 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600 transition">
                  <span className="font-semibold text-white">Verified Profiles Only</span>
                  <div className={`w-12 h-6 rounded-full transition px-1 flex items-center ${verifiedOnly ? 'bg-primary' : 'bg-slate-700'}`}>
                    <motion.div animate={{ x: verifiedOnly ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                  <input type="checkbox" className="hidden" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} />
                </label>

                <label className="flex justify-between items-center p-4 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600 transition">
                  <span className="font-semibold text-white">Online Now</span>
                  <div className={`w-12 h-6 rounded-full transition px-1 flex items-center ${onlineOnly ? 'bg-green-500' : 'bg-slate-700'}`}>
                    <motion.div animate={{ x: onlineOnly ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                  <input type="checkbox" className="hidden" checked={onlineOnly} onChange={() => setOnlineOnly(!onlineOnly)} />
                </label>
              </section>

              {/* Interests */}
              <section>
                <h3 className="font-semibold text-white mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                          isSelected 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-slate-900 border-slate-700 text-gray-300 hover:border-slate-500'
                        }`}
                      >
                        {isSelected && <Check size={14} className="inline mr-1" />}
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </section>
              
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-800 bg-surface sticky bottom-0 flex gap-4">
              <button 
                onClick={resetFilters}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-[2] py-4 bg-primary hover:bg-pink-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] transition"
              >
                Apply Filters
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
