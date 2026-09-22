import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/discover', icon: Search, label: 'Discover' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-slate-800 h-full p-6">
        <Link to="/discover" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-12">
          Pairly
        </Link>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                  isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={24} className={isActive ? 'text-primary' : ''} />
                <span className="text-lg">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="pt-6 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">Demo User</p>
              <p className="text-xs text-gray-500">Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative h-full overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-slate-800 z-50 px-6 py-4 flex justify-between items-center pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
