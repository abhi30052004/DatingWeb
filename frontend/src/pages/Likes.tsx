import { Star } from 'lucide-react';

export default function Likes() {
  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Likes</h1>
        <p className="text-gray-400">See who liked you.</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <Star size={40} className="text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p>Premium feature to see who liked your profile.</p>
      </div>
    </div>
  );
}
