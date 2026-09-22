import { useState, useEffect } from 'react';
import { Loader2, Save, Lock, Eye, EyeOff, Shield, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../services/api';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Privacy & Preference State
  const [isVisible, setIsVisible] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [interestedIn, setInterestedIn] = useState('everyone');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(99);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/profiles/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsVisible(data.is_visible !== false);
          setIncognitoMode(data.incognito_mode || false);
          setMaxDistance(data.max_distance || 50);
          setInterestedIn(data.interested_in || 'everyone');
          setMinAge(data.min_age || 18);
          setMaxAge(data.max_age || 99);
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/profiles/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          is_visible: isVisible,
          incognito_mode: incognitoMode,
          max_distance: maxDistance,
          interested_in: interestedIn,
          min_age: minAge,
          max_age: maxAge
        })
      });
      if (res.ok) {
        toast.success("Preferences saved!");
      } else {
        toast.error("Failed to save preferences");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setSavingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      if (res.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        toast.error(data.detail || "Failed to change password");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Security Section */}
        <div className="bg-surface border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Account Security</h2>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {savingPassword ? <Loader2 size={20} className="animate-spin" /> : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Privacy Controls Section */}
        <div className="bg-surface border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Privacy Controls</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div>
                <p className="font-semibold flex items-center gap-2">
                  {isVisible ? <Eye size={16} className="text-green-400" /> : <EyeOff size={16} className="text-red-400" />}
                  Show me on Pairly
                </p>
                <p className="text-sm text-gray-400">Turn this off if you want to hide your profile from the discovery stack.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isVisible} onChange={() => setIsVisible(!isVisible)} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div>
                <p className="font-semibold">Incognito Mode</p>
                <p className="text-sm text-gray-400">Only people you have Liked can see your profile.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={incognitoMode} onChange={() => setIncognitoMode(!incognitoMode)} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Discovery Preferences */}
        <div className="bg-surface border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Sliders className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Discovery Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-white">Maximum Distance</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1" 
                    max="1000"
                    value={maxDistance}
                    onChange={e => setMaxDistance(parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-primary font-bold focus:border-primary transition"
                  />
                  <span className="text-sm text-gray-400">km</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-800" />

            <div>
              <label className="block text-sm font-medium text-white mb-2">Show me</label>
              <select 
                value={interestedIn}
                onChange={e => setInterestedIn(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition appearance-none"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>

            <hr className="border-slate-800" />

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-white">Age Range</label>
                <span className="text-sm text-primary font-bold">{minAge} - {maxAge}</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  min="18" 
                  max={maxAge}
                  value={minAge}
                  onChange={e => setMinAge(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="number" 
                  min={minAge} 
                  max="99"
                  value={maxAge}
                  onChange={e => setMaxAge(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSavePreferences}
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Save Preferences
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
