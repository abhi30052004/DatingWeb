import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, User, Star, LogOut, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalUnread, clearUnread } = useNotifications();
  const [imgError, setImgError] = useState(false);

  // Clear badge when navigating to messages
  useEffect(() => {
    if (location.pathname.startsWith('/messages')) {
      clearUnread();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const desktopNavItems = [
    { path: '/discover', icon: Search, label: 'Discover' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/likes', icon: Star, label: 'Likes' },
  ];

  const mobileNavItems = [
    { path: '/discover', icon: Search, label: 'Discover' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/likes', icon: Star, label: 'Likes' },
  ];

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-slate-800 h-full p-6">
        <Link to="/discover" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-12">
          Pairly
        </Link>
        <nav className="flex-1 space-y-2">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const isMessages = item.path === '/messages';
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                  isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="relative">
                  <item.icon size={24} className={isActive ? 'text-primary' : ''} />
                  {isMessages && totalUnread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                  )}
                </div>
                <span className="text-lg">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="pt-6 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Link to="/profile" className="flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition">
                {user?.profile_photo && !imgError && user.profile_photo !== "null" ? (
                  <img 
                    src={user.profile_photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)} 
                  />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate capitalize group-hover:text-primary transition">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
              </div>
            </Link>
          </div>
          <div className="flex px-4 gap-2">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition" title="Log out">
              <LogOut size={18} />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative h-full overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-slate-800 z-50 px-6 py-4 flex justify-between items-center pb-safe">
        {mobileNavItems.map((item) => {
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
