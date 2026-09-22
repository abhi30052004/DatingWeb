import { useState, useEffect } from 'react';
import { Camera, MapPin, Loader2, Save, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Edit States
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [profession, setProfession] = useState('');
  const [isEditingProfession, setIsEditingProfession] = useState(false);
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [goal, setGoal] = useState('');
  const [interestedIn, setInterestedIn] = useState('everyone');
  const [smoking, setSmoking] = useState('No preference');
  const [drinking, setDrinking] = useState('No preference');
  const [pets, setPets] = useState('No preference');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/profiles/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(user?.name || '');
          setDob(user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '');
          setProfilePhoto(data.profile_photo || '');
          setBio(data.bio || '');
          setProfession(data.profession || '');
          setCity(data.city || '');
          setStateProv(data.state || '');
          setGoal(data.relationship_goal || '');
          setInterestedIn(data.interested_in || 'everyone');
          setSmoking(data.smoking || 'No preference');
          setDrinking(data.drinking || 'No preference');
          setPets(data.pets || 'No preference');
          setInterests(data.interests || []);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/profiles/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          name,
          date_of_birth: dob,
          profile_photo: profilePhoto,
          bio, 
          profession,
          city, 
          state: stateProv, 
          relationship_goal: goal,
          interested_in: interestedIn,
          smoking,
          drinking,
          pets,
          interests
        })
      });
      if (res.ok) {
        toast.success("Profile updated!");
        updateUser({ name, date_of_birth: dob, profile_photo: profilePhoto });
        // We reload to update the auth context user name across the app if name changed (optional now since context updates)
        if (name !== user?.name) {
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/profiles/photo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfilePhoto(data.url);
        toast.success("Profile photo uploaded!");
      } else {
        toast.error("Failed to upload photo");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  // Calculate age based on user.date_of_birth
  let age = '';
  if (user?.date_of_birth) {
    const dob = new Date(user.date_of_birth);
    const today = new Date();
    let calculatedAge = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      calculatedAge--;
    }
    age = `, ${calculatedAge}`;
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="bg-surface border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shrink-0 group">
            {profilePhoto || profile?.profile_photo ? (
              <img 
                src={profilePhoto || profile.profile_photo} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' }}
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Camera size={32} className="text-slate-500" />
              </div>
            )}
            {/* Edit overlay */}
            <label 
              htmlFor="photo-upload"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
            >
              {uploadingPhoto ? (
                <Loader2 size={24} className="text-white mb-1 animate-spin" />
              ) : (
                <Camera size={24} className="text-white mb-1" />
              )}
              <span className="text-xs text-white font-medium">{uploadingPhoto ? 'Uploading...' : 'Upload'}</span>
            </label>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload} 
              disabled={uploadingPhoto}
            />
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl font-bold capitalize mb-1">{user?.name}{age}</h1>
            <p className="text-primary font-medium mb-3">{user?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-slate-900/80 px-3 py-1 rounded-full text-sm text-gray-300 font-medium flex items-center gap-1">
                <MapPin size={14} className="text-primary" /> {city || 'City'}, {stateProv || 'State'}
              </span>
              <span className="bg-slate-900/80 px-3 py-1 rounded-full text-sm text-gray-300 font-medium">
                {interests.length} Interests
              </span>
            </div>
            
            {/* Display Interests Tags */}
            {interests.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {interests.map((interest, idx) => (
                  <span key={idx} className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-semibold">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-surface border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">Display Name</label>
                {!isEditingName ? (
                  <button type="button" onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-white transition flex items-center gap-1">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsEditingName(false)} className="text-primary hover:text-pink-400 transition text-sm font-medium">
                    Done
                  </button>
                )}
              </div>
              {isEditingName ? (
                <input 
                  type="text" 
                  value={name}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                />
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="w-full bg-slate-900/50 border border-transparent hover:border-slate-700 rounded-xl px-4 py-3 text-white cursor-pointer transition"
                >
                  {name || "Set a display name"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
              <input 
                type="date" 
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">Profession</label>
                {!isEditingProfession ? (
                  <button type="button" onClick={() => setIsEditingProfession(true)} className="text-gray-500 hover:text-white transition flex items-center gap-1">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsEditingProfession(false)} className="text-primary hover:text-pink-400 transition text-sm font-medium">
                    Done
                  </button>
                )}
              </div>
              {isEditingProfession ? (
                <input 
                  type="text" 
                  value={profession}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && setIsEditingProfession(false)}
                  onChange={e => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                />
              ) : (
                <div 
                  onClick={() => setIsEditingProfession(true)}
                  className="w-full bg-slate-900/50 border border-transparent hover:border-slate-700 rounded-xl px-4 py-3 text-white cursor-pointer transition"
                >
                  {profession || <span className="text-gray-500">Add profession...</span>}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-400">Bio</label>
              {!isEditingBio ? (
                <button type="button" onClick={() => setIsEditingBio(true)} className="text-gray-500 hover:text-white transition flex items-center gap-1">
                  <Edit2 size={14} /> Edit
                </button>
              ) : (
                <button type="button" onClick={() => setIsEditingBio(false)} className="text-primary hover:text-pink-400 transition text-sm font-medium">
                  Done
                </button>
              )}
            </div>
            {isEditingBio ? (
              <textarea 
                value={bio}
                autoFocus
                onChange={e => setBio(e.target.value)}
                placeholder="Tell people about yourself..."
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition resize-none"
              />
            ) : (
              <div 
                onClick={() => setIsEditingBio(true)}
                className="w-full min-h-[128px] bg-slate-900/50 border border-transparent hover:border-slate-700 rounded-xl px-4 py-3 text-white cursor-pointer transition whitespace-pre-wrap"
              >
                {bio || <span className="text-gray-500">Add a bio...</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
              <input 
                type="text" 
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
              <input 
                type="text" 
                value={stateProv}
                onChange={e => setStateProv(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Interests (Select at least 5)</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Travel", "Music", "Movies", "Books", "Gaming", "Food", 
                "Photography", "Fitness", "Sports", "Technology", "Art", 
                "Fashion", "Cooking", "Nature", "Dancing", "Writing", 
                "Coffee", "Pets", "Adventure", "Reading"
              ].map(interest => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setInterests(interests.filter(i => i !== interest));
                      } else {
                        setInterests([...interests, interest]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      isSelected 
                        ? 'bg-primary text-white border border-primary shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                        : 'bg-slate-900 text-gray-400 border border-slate-700 hover:border-gray-500'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Relationship Goal</label>
            <select 
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition appearance-none"
            >
              <option value="" disabled>Select a goal</option>
              <option value="Long-term relationship">Long-term relationship</option>
              <option value="Short-term relationship">Short-term relationship</option>
              <option value="Casual dating">Casual dating</option>
              <option value="Friendship">Friendship</option>
              <option value="Still figuring it out">Still figuring it out</option>
            </select>
          </div>

          <hr className="border-slate-800 my-6" />
          <h3 className="text-lg font-bold mb-4">Dating Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Interested In</label>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Smoking</label>
              <select 
                value={smoking}
                onChange={e => setSmoking(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition appearance-none"
              >
                <option value="No preference">No preference</option>
                <option value="Never">Never</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Drinking</label>
              <select 
                value={drinking}
                onChange={e => setDrinking(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition appearance-none"
              >
                <option value="No preference">No preference</option>
                <option value="Never">Never</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Pets</label>
              <select 
                value={pets}
                onChange={e => setPets(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition appearance-none"
              >
                <option value="No preference">No preference</option>
                <option value="Have pets">Have pets</option>
                <option value="Love pets">Love pets</option>
                <option value="Not interested">Not interested</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
