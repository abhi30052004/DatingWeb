import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Camera, MapPin, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../services/api';
import { AuroraBackground } from '../components/ui/AuroraBackground';

const INTERESTS = [
  'Travel', 'Music', 'Movies', 'Books', 'Gaming', 'Food', 'Photography',
  'Fitness', 'Sports', 'Technology', 'Art', 'Fashion', 'Cooking',
  'Nature', 'Dancing', 'Writing', 'Coffee', 'Pets', 'Adventure', 'Reading'
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Account (plus OTP step mapped to 1.5 conceptually, but let's make it Step 2 internally, so total 6 steps)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState('');

  // Step 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Step 3: About You
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(''); // Simulated single primary photo

  // Step 4: Interests & Personality
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [weekend, setWeekend] = useState('');
  const [customWeekend, setCustomWeekend] = useState('');
  const [introExtro] = useState(''); // Kept state variable

  // Step 5: Preferences
  const [interestedIn, setInterestedIn] = useState('everyone');
  const [goal, setGoal] = useState('');
  const [ageRange] = useState([18, 40]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 10) setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (step === 1) {
      if (password !== confirmPassword) return toast.error("Passwords don't match");
      const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(demoOtp);
      toast.success(`DEMO OTP: ${demoOtp}`, { duration: 8000, icon: '🔑' });
      setStep(2);
    }
    else if (step === 2) {
      const enteredOtp = otp.join('');
      if (enteredOtp !== generatedOtp) return toast.error('Invalid OTP.');

      // Register user
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, date_of_birth: dob, gender: gender || 'other' })
        });
        if (!response.ok) throw new Error('Registration failed');

        // Auto Login
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem('token', data.access_token);
          toast.success("Account Created!");
          setStep(3); // Go to About You
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    else if (step === 3) {
      if (!gender || !city || !photo) return toast.error("Please fill in required fields and add a photo.");
      setStep(4);
    }
    else if (step === 4) {
      if (selectedInterests.length < 5) return toast.error("Please select at least 5 interests.");
      if (weekend === 'Other' && !customWeekend.trim()) return toast.error("Please specify your ideal weekend.");
      setStep(5);
    }
    else if (step === 5) {
      if (!goal) return toast.error("Please select a relationship goal.");
      setStep(6);
    }
    else if (step === 6) {
      // Final Submit Profile
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/profiles/me`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            city, state: stateProv, bio, profile_photo: photo, photos: [photo],
            interests: selectedInterests, interested_in: interestedIn,
            relationship_goal: goal, min_age: ageRange[0], max_age: ageRange[1],
            introvert_extrovert: introExtro, weekend_preference: weekend === 'Other' ? customWeekend : weekend
          })
        });
        toast.success("Profile completed!");
        window.location.href = '/discover';
      } catch (err) {
        toast.error("Failed to save profile");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload with local object URL
      setPhoto(URL.createObjectURL(file));
    }
  };

  const currentDisplayStep = step > 2 ? step - 2 : 1;
  const totalDisplaySteps = 4; // Account, About, Interests, Preferences/Preview

  return (
    <AuroraBackground className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="relative z-10 p-6 flex items-center w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition group z-20">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-primary font-black text-2xl tracking-tighter">PAIRLY</h1>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center w-full p-4">
        <div className="w-full max-w-xl">
          {/* Progress Indicator */}
          {step > 2 && step < 6 && (
            <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2 px-1">
                <span className={currentDisplayStep >= 1 ? 'text-primary' : ''}>About</span>
                <span className={currentDisplayStep >= 2 ? 'text-primary' : ''}>Interests</span>
                <span className={currentDisplayStep >= 3 ? 'text-primary' : ''}>Preferences</span>
                <span className={currentDisplayStep >= 4 ? 'text-primary' : ''}>Preview</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${(currentDisplayStep / totalDisplaySteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={step === 6 ? "" : "bg-surface/50 backdrop-blur-xl border border-white/5 p-6 md:p-10 rounded-[2rem] shadow-2xl"}
            >
              <form onSubmit={handleNext}>

                {/* STEP 1: ACCOUNT */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-3xl font-bold mb-2">Let's get you started.</h2>
                    <p className="text-gray-400 mb-6">Create an account to discover your vibe.</p>

                    <div className="space-y-4">
                      <input type="text" required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition" />
                      <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary transition" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} required placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary transition" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 pl-1">Date of Birth</label>
                        <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-primary transition" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: OTP */}
                {step === 2 && (
                  <div className="space-y-6 text-center">
                    <h2 className="text-3xl font-bold mb-2">Verify Email</h2>
                    <p className="text-gray-400">We've sent a code to <span className="text-white">{email}</span></p>
                    <div className="flex justify-center gap-2 py-4">
                      {otp.map((d, i) => (
                        <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={d}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp);
                            if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
                          }}
                          className="w-12 h-14 text-center text-xl font-bold bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-primary transition"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: ABOUT YOU */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold mb-2">Tell us a little about yourself.</h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Profile Photo</label>
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center hover:border-primary transition group cursor-pointer">
                        {photo ? (
                          <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="text-slate-500 group-hover:text-primary transition" />
                        )}
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">I identify as</label>
                      <div className="flex gap-3 flex-wrap">
                        {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => (
                          <button key={g} type="button" onClick={() => setGender(g.toLowerCase())}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${gender === g.toLowerCase() ? 'bg-primary border-primary text-white' : 'bg-transparent border-slate-700 text-gray-300 hover:border-slate-500'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                        <input type="text" required placeholder="e.g. San Francisco" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                        <input type="text" required placeholder="e.g. CA" value={stateProv} onChange={e => setStateProv(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                      <textarea placeholder="Tell people what makes you, you." maxLength={200} value={bio} onChange={e => setBio(e.target.value)} className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition resize-none" />
                    </div>
                  </div>
                )}

                {/* STEP 4: INTERESTS */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">What are you into?</h2>
                      <p className="text-gray-400">Choose at least 5 interests.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 py-2">
                      {INTERESTS.map(interest => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                          <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${isSelected ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-slate-900/50 border-slate-700 text-gray-300 hover:border-slate-500'}`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <label className="block text-sm font-medium text-gray-400 mb-3">My ideal weekend is...</label>
                      <div className="flex flex-col gap-2">
                        {['Relaxing at home', 'Exploring the city', 'Traveling', 'Going out with friends', 'Other'].map(opt => (
                          <div key={opt}>
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${weekend === opt ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900/50 border-slate-700 text-gray-400'}`}>
                              <input type="radio" name="weekend" className="hidden" checked={weekend === opt} onChange={() => setWeekend(opt)} />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${weekend === opt ? 'border-primary' : 'border-slate-600'}`}>
                                {weekend === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              {opt}
                            </label>
                            {opt === 'Other' && weekend === 'Other' && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 pl-2">
                                <input
                                  type="text"
                                  placeholder="Type your ideal weekend..."
                                  value={customWeekend}
                                  onChange={e => setCustomWeekend(e.target.value)}
                                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition"
                                />
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: PREFERENCES */}
                {step === 5 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold mb-2">Who are you looking for?</h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Interested in</label>
                      <div className="flex gap-3">
                        {['Men', 'Women', 'Everyone'].map(g => (
                          <button key={g} type="button" onClick={() => setInterestedIn(g.toLowerCase())}
                            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${interestedIn === g.toLowerCase() ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-900/50 border-slate-700 text-gray-300'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Relationship Goal</label>
                      <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition">
                        <option value="" disabled>Select a goal</option>
                        <option value="Long-term relationship">Long-term relationship</option>
                        <option value="Short-term relationship">Short-term relationship</option>
                        <option value="Casual dating">Casual dating</option>
                        <option value="Friendship">Friendship</option>
                        <option value="Still figuring it out">Still figuring it out</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 6: PREVIEW */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-bold mb-2">Your profile is ready.</h2>
                      <p className="text-gray-400">This is how others will see you in Discover.</p>
                    </div>

                    <div className="relative w-full max-w-sm mx-auto h-[60vh] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-surface border border-slate-800">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80'})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 w-full p-6 text-left">
                        <h2 className="text-4xl font-bold text-white mb-1 capitalize">{name || 'Sarah'}, 24</h2>
                        <p className="flex items-center text-gray-300 gap-1 text-sm mb-3">
                          <MapPin size={16} /> {city || 'Your City'}, {stateProv || 'Your State'}
                        </p>
                        <p className="text-gray-200 text-sm line-clamp-2 mb-4">"{bio || 'Weekend traveler, coffee lover.'}"</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedInterests.slice(0, 3).map(i => (
                            <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium text-white">{i}</span>
                          ))}
                          {selectedInterests.length > 3 && <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium text-white">+{selectedInterests.length - 3}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8 mt-4 border-t border-white/5">
                  {(step > 2 && step < 6) && (
                    <button type="button" onClick={() => setStep(step - 1)} className="w-1/3 bg-slate-800/50 hover:bg-slate-800 transition text-white font-semibold rounded-xl px-4 py-4">
                      Back
                    </button>
                  )}
                  <button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-pink-600 disabled:opacity-50 transition text-white font-semibold rounded-xl px-4 py-4 shadow-lg shadow-primary/20 flex justify-center items-center gap-2 text-lg">
                    {isLoading ? <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : step === 6 ? 'Start Discovering →' : 'Continue'}
                  </button>
                </div>

                {step === 1 && (
                  <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Log in</Link>
                  </p>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AuroraBackground>
  );
}
