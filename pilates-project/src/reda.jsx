import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Activity, 
  LogOut, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Printer,
  User,
  MessageCircle,
  Send,
  X,
  History,
  RefreshCw,
  Sparkles,
  Filter,
  Trophy,
  Heart,
  Trash2,
  Home,
  Bell,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Settings,
  RotateCcw,
  Check
} from 'lucide-react';

// --- Mock Data & Assets ---

const THEME = {
  primary: '#5D4037',    // Dark Brown
  secondary: '#8D6E63',  // Medium Brown
  accent: '#E6D0C0',     // Soft Beige
  bg: '#FFFCF9',         // Cream
  highlight: '#F5E6DA',  // Pale Orange/Gray
  chatBubble: '#FFF5EE', // Very Light Orange
  success: '#4A7C59',    // Muted Green
  error: '#B91C1C'       // Muted Red
};

const WELLNESS_TIPS = [
  "Hydration is key! Aim for 8-10 glasses of water today.",
  "Listen to your body. If a movement feels wrong, stop and rest.",
  "Your posture supports your baby. Keep your shoulders back and down.",
  "Deep breathing calms both you and your little one.",
  "Sleep is productive. Nap if you need to!",
  "You are strong, capable, and doing an amazing job."
];

const EXERCISES = [
  {
    id: 1,
    title: "Morning Gentle Flow",
    category: "Mobility",
    trimester: "1st",
    duration: "15 min",
    focus: "Nausea Relief",
    url: "https://www.youtube.com/embed/s-7lyvblFNI", 
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Energy Boost & Strength",
    category: "Strength",
    trimester: "2nd",
    duration: "20 min",
    focus: "Posture Support",
    url: "https://www.youtube.com/embed/v7AYKMP6rOE",
    thumbnail: "https://images.unsplash.com/photo-1544367563-12123d8966cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Hip Opener Flow",
    category: "Mobility",
    trimester: "2nd",
    duration: "18 min",
    focus: "Hip Mobility",
    url: "https://www.youtube.com/embed/4pF125F_Y",
    thumbnail: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Pelvic Floor Connection",
    category: "Strength",
    trimester: "3rd",
    duration: "10 min",
    focus: "Labor Prep",
    url: "https://www.youtube.com/embed/0p6YG_l_iM",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Lower Back Ease",
    category: "Relaxation",
    trimester: "3rd",
    duration: "12 min",
    focus: "Pain Relief",
    url: "https://www.youtube.com/embed/4pF125F_Y",
    thumbnail: "https://images.unsplash.com/photo-1599447421405-0e5a19618e98?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Bedtime Breathing",
    category: "Relaxation",
    trimester: "1st",
    duration: "8 min",
    focus: "Relaxation",
    url: "https://www.youtube.com/embed/s-7lyvblFNI",
    thumbnail: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=800&q=80"
  }
];

const TRIMESTER_CONTENT = {
  1: {
    focus: "Gentle mobility, back/hip opening, breathing awareness",
    range: "Months 1-3",
    tips: ["Listen to your energy levels", "Hydrate frequently", "Focus on deep belly breathing"],
    dailyFocus: ["Rest", "Gentle Walk", "Prenatal Yoga", "Rest", "Stretching", "Walk", "Rest"]
  },
  2: {
    focus: "Posture support, chest/hip flexor stretches, balance",
    range: "Months 4-6",
    tips: ["Engage your core lightly", "Watch your posture", "Incorporate light resistance"],
    dailyFocus: ["Strength", "Cardio Walk", "Yoga Flow", "Rest", "Leg Strength", "Long Walk", "Rest"]
  },
  3: {
    focus: "Pelvic mobility, lower-back ease, relaxation",
    range: "Months 7-9",
    tips: ["Focus on pelvic opening", "Practice labor breathing", "Use props for support"],
    dailyFocus: ["Pelvic Tilts", "Short Walk", "Labor Prep", "Rest", "Open Hips", "Breathing", "Rest"]
  }
};

// --- Components ---

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-50 animate-fade-in-up">
      <div className="bg-green-500 rounded-full p-1">
        <Check size={12} />
      </div>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const WellnessChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your wellness companion. How is your body feeling today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let botResponseText = "That's a great question. Always listen to your body first.";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('pain') || lowerInput.includes('back')) {
        botResponseText = "Back pain is common. Try the 'Lower Back Ease' session in the Exercises tab. If pain is sharp, please consult your doctor.";
      } else if (lowerInput.includes('tired') || lowerInput.includes('sleep')) {
        botResponseText = "Rest is productive! Your body is working hard growing a life. Try the 'Bedtime Breathing' exercise to help you unwind.";
      } else if (lowerInput.includes('plan') || lowerInput.includes('routine')) {
        botResponseText = "Consistency over intensity. Check your Planner tab for today's suggested gentle activity.";
      }

      const botMsg = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center border-2 border-white"
        style={{ backgroundColor: THEME.primary, color: 'white' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300" style={{ borderColor: THEME.accent }}>
          <div className="p-4 border-b flex items-center gap-2" style={{ backgroundColor: THEME.primary, color: 'white' }}>
            <Sparkles size={18} />
            <h3 className="font-medium">Wellness Assistant</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-gray-800'}`}
                  style={{ backgroundColor: msg.sender === 'user' ? THEME.secondary : 'white', border: msg.sender === 'bot' ? `1px solid ${THEME.accent}` : 'none' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: THEME.accent, '--tw-ring-color': THEME.highlight }}
            />
            <button type="submit" className="p-2 rounded-full transition-colors hover:bg-gray-100" style={{ color: THEME.primary }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

const DailyRecommendation = ({ trimester, compact = false }) => {
  const todayIndex = new Date().getDay();
  const relevantExercises = EXERCISES.filter(e => e.trimester === trimester.toString() || e.trimester === "All");
  const recommended = relevantExercises[todayIndex % relevantExercises.length] || EXERCISES[0];
  const tip = WELLNESS_TIPS[todayIndex % WELLNESS_TIPS.length];

  if (compact) {
     return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border flex group cursor-pointer hover:shadow-md hover:border-[#E6D0C0] transition-all" style={{ borderColor: THEME.accent }}>
          <div className="w-28 h-28 md:w-40 md:h-auto relative flex-shrink-0 overflow-hidden">
             <img src={recommended.thumbnail} alt="Exercise" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-sm transform group-hover:scale-110 transition-all">
                    <Play size={16} fill={THEME.primary} stroke="none" />
                </div>
             </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center bg-white group-hover:bg-[#FFFCF9] transition-colors">
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] uppercase font-bold tracking-wider text-[#8D6E63] bg-[#F5E6DA] px-2 py-0.5 rounded-full">Daily Pick</span>
                 <span className="text-[10px] text-gray-400">{recommended.duration}</span>
             </div>
             <h4 className="font-serif text-xl mb-1 leading-tight group-hover:text-[#5D4037] transition-colors" style={{ color: THEME.primary }}>{recommended.title}</h4>
             <p className="text-xs text-gray-500">Focus: {recommended.focus}</p>
          </div>
      </div>
     )
  }

  return (
    <div className="bg-white rounded-xl p-0 shadow-sm border mb-8 flex flex-col md:flex-row overflow-hidden group hover:shadow-md transition-shadow" style={{ borderColor: THEME.accent }}>
      <div className="p-6 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: THEME.highlight, color: THEME.primary }}>
            Daily Pick
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Sparkles size={12} color={THEME.secondary}/> {tip}
          </div>
        </div>
        
        <h3 className="text-3xl font-serif mb-2" style={{ color: THEME.primary }}>{recommended.title}</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Selected for your <strong>{trimester === '1' ? '1st' : trimester === '2' ? '2nd' : '3rd'} Trimester</strong>. 
          Today's focus is on <span className="italic">{recommended.focus}</span> to help you feel grounded.
        </p>
        
        <button className="self-start flex items-center gap-2 text-sm font-medium px-6 py-2 rounded-lg text-white transition-transform transform active:scale-95 hover:opacity-90" style={{ backgroundColor: THEME.secondary }}>
          <Play size={16} fill="white" /> Start Session
        </button>
      </div>
      
      <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
        <img src={recommended.thumbnail} alt="Exercise" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent md:bg-gradient-to-l"></div>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onNext }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: THEME.bg }}>
    {/* Decorative Background Elements */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5D4037] via-[#8D6E63] to-[#E6D0C0] z-20"></div>
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" style={{ backgroundColor: THEME.accent }}></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: THEME.highlight }}></div>
    
    {/* Main Content Container */}
    <div className="max-w-lg w-full z-10 flex flex-col items-center text-center animate-fade-in space-y-8">
      
      {/* Icon / Illustration */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/50 backdrop-blur-sm" style={{ backgroundColor: THEME.highlight }}>
           <BookOpen size={36} color={THEME.primary} strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-white">
           <Heart size={16} color={THEME.secondary} fill={THEME.accent} />
        </div>
      </div>
      
      {/* Typography & Message */}
      <div>
        <span className="inline-block py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border" style={{ borderColor: THEME.accent, color: THEME.secondary, backgroundColor: 'rgba(255,255,255,0.5)' }}>
           Welcome to your Sanctuary
        </span>
        <h1 className="text-5xl md:text-6xl font-serif italic mb-6 leading-tight" style={{ color: THEME.primary }}>
          Wellness<br/>Companion
        </h1>
        
        <div className="space-y-5 max-w-md mx-auto">
          <p className="text-lg font-medium leading-relaxed" style={{ color: THEME.primary }}>
            Thank you for purchasing our ebook! We’re excited to guide you through your wellness journey.
          </p>
          <p className="text-sm leading-relaxed opacity-80 font-light" style={{ color: THEME.secondary }}>
            Your path to comfort, balance, and relaxation starts here. <br/> Breathe deep, move gently, and embrace this season.
          </p>
        </div>
      </div>
      
      {/* CTA Button */}
      <div className="w-full pt-6">
        <button 
          onClick={onNext}
          className="group w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-[0.99]"
          style={{ backgroundColor: THEME.primary, color: 'white' }}
        >
          <span className="font-medium tracking-wide text-lg">Begin Journey</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-xs opacity-50 pt-4 font-medium tracking-wide" style={{ color: THEME.secondary }}>
        Part of your ebook companion experience
      </p>
    </div>
  </div>
);

const LoginScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

//   **const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (isSignUp) {
//         // Signup Logic
//         if (!name || !email || !password || !confirmPassword) {
//             setError("All fields are required.");
//             return;
//         }
//         if (password !== confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }
//         // Simulate Account Creation & Data Persistence
//         const userData = { name, email };
//     localStorage.setItem(`user_${email}`, JSON.stringify(userData));
//     onLogin(userData);






//     } else {
//         // Login Logic
//         if (!email || !password) {
//            setError("Please enter email and password.");
//            return;
//         }
//         // Simulate Login Retrieval (in real app verify password here)
//         const storedUser = localStorage.getItem(`user_${email}`);
//         if (storedUser) {
//             const userData = JSON.parse(storedUser);
//             onLogin(userData);
//         } else {
//             // Fallback for demo purposes if no user found (or treat as guest)
//             onLogin({ name: 'Guest', email });
//         }








//     }
//   };      **

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  try {
    if (isSignUp) {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // ✅ APPEL REGISTER - PostgreSQL
      const response = await fetch("https://fitnessapp-n34v.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: name,
          mail: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // ✅ Connexion automatique après inscription
      const userData = { name, email };
      onLogin(userData);
      setToastMessage("Welcome! Account created successfully ✅");

    } else {

      
      // Login
      if (!email || !password) {
        setError("Please enter email and password.");
        return;
      }

      // ✅ APPEL LOGIN - PostgreSQL
      const response = await fetch("https://fitnessapp-n34v.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const userData = await response.json();
      onLogin(userData);
      setToastMessage("Welcome back! ✅");
    }
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: THEME.bg }}>
       <Toast message={toastMessage} onClose={() => setToastMessage('')} />
       {/* Subtle Background Elements */}
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5D4037] via-[#8D6E63] to-[#E6D0C0]"></div>
       
      <div className={`max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-white/50 relative z-10 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        
        <div className="text-center mb-8">
           <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner" style={{ backgroundColor: THEME.highlight }}>
              <BookOpen size={24} color={THEME.primary} />
           </div>
           <h2 className="text-3xl font-serif mb-1" style={{ color: THEME.primary }}>
             {isSignUp ? "Create Account" : "Member Login"}
           </h2>
           <p className="text-sm text-gray-500">
             {isSignUp ? "Join our wellness community" : "Access your personalized planner"}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70" style={{ color: THEME.secondary }}>Name</label>
                <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 focus:outline-none transition-all border-gray-100"
                    style={{ '--tw-ring-color': THEME.highlight }}
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your Name"
                    />
                </div>
              </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70" style={{ color: THEME.secondary }}>Email</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
              type="email" 
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 focus:outline-none transition-all ${error && !email ? 'border-red-300 bg-red-50' : 'border-gray-100'}`}
              style={{ '--tw-ring-color': THEME.highlight }}
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70" style={{ color: THEME.secondary }}>Password</label>
                <div className="relative">
                <input 
                type={showPassword ? "text" : "password"} 
                className={`w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 focus:outline-none transition-all ${error && !password ? 'border-red-300 bg-red-50' : 'border-gray-100'}`}
                style={{ '--tw-ring-color': THEME.highlight }}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          {isSignUp && (
             <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70" style={{ color: THEME.secondary }}>Confirm Password</label>
                <div className="relative">
                    <input 
                    type="password" 
                    className={`w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 focus:outline-none transition-all ${error && (!confirmPassword || password !== confirmPassword) ? 'border-red-300 bg-red-50' : 'border-gray-100'}`}
                    style={{ '--tw-ring-color': THEME.highlight }}
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    />
                </div>
             </div>
          )}

          {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-3 rounded-lg animate-fade-in">
                  <AlertCircle size={14} />
                  <span>{error}</span>
              </div>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl font-medium transition-all mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: THEME.primary, color: 'white' }}
          >
            {isSignUp ? "Start My Journey" : "Enter Sanctuary"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <button 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-sm hover:underline underline-offset-4 font-medium transition-colors"
                style={{ color: THEME.secondary }}
            >
                {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
            </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm font-medium italic" style={{ color: THEME.secondary }}>
                "Your wellness journey starts here."
            </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

// --- Overview Dashboard Component ---

const OverviewSection = ({ user, onViewChange }) => {
  const todayTip = WELLNESS_TIPS[new Date().getDay() % WELLNESS_TIPS.length];
  const firstName = user?.name?.split(' ')[0] || 'Guest';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in relative">
        {/* Decorative Background (Subtle) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5E6DA]/30 rounded-full blur-3xl -z-10"></div>

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                   <Sun size={18} color={THEME.secondary} />
                   <span className="text-xs font-bold uppercase tracking-widest" style={{ color: THEME.secondary }}>Good Morning</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif" style={{ color: THEME.primary }}>Hello, {firstName}.</h1>
                <p className="text-lg font-light mt-2" style={{ color: THEME.secondary }}>Ready to nurture yourself today?</p>
            </div>
            {/* Optional Date Display */}
            <div className="text-right hidden md:block">
               <p className="text-sm font-medium text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            
            {/* Column 1: Reminder & Progress (Left) */}
            <div className="space-y-6 lg:col-span-2">
                
                {/* Reminder Banner - Redesigned */}
                <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-start gap-4 relative overflow-hidden group hover:shadow-md transition-all" style={{ borderColor: THEME.accent }}>
                    <div className="absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: THEME.secondary }}></div>
                    <div className="p-3 rounded-full bg-[#FFF5EE] text-[#8D6E63] flex-shrink-0">
                        <Activity size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-serif text-lg mb-1" style={{ color: THEME.primary }}>Daily Rhythm</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Don't forget to complete today's routine. Consistency is your superpower!</p>
                        <div className="flex justify-end mt-2">
                            <button onClick={() => onViewChange('planner')} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:text-[#5D4037] transition-colors" style={{ color: THEME.secondary }}>
                                Go to Planner <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trimester Progress - Redesigned */}
                <div className="bg-gradient-to-br from-[#5D4037] to-[#8D6E63] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-black/10 blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider border border-white/20 px-2 py-1 rounded-md">Trimester 1</span>
                            <h3 className="font-serif text-3xl mt-3">Week 8</h3>
                            <p className="text-sm text-white/80 font-light mt-1">Baby is the size of a raspberry</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                             <Calendar size={20} color="white" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between text-[10px] mb-2 font-medium text-white/70 uppercase tracking-wide">
                           <span>Start</span>
                           <span>End</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden backdrop-blur-sm border border-white/5">
                            <div className="h-full rounded-full bg-[#F5E6DA] shadow-[0_0_15px_rgba(245,230,218,0.6)] relative" style={{ width: '40%' }}>
                                <div className="absolute right-0 top-0 h-full w-2 bg-white/50 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-right mt-2 text-xs text-white/60">40% Complete</div>
                    </div>
                </div>

            </div>

            {/* Column 2: Motivational Tip (Right) */}
            <div className="lg:col-span-1">
                <div className="h-full bg-[#FFFBF7] p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#E6D0C0] transition-colors" style={{ borderColor: THEME.accent }}>
                     <div className="absolute right-0 top-0 w-48 h-48 bg-[#F5E6DA] rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2 group-hover:opacity-60 transition-opacity"></div>
                     
                     <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles size={16} className="text-amber-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Daily Wisdom</span>
                        </div>
                        <div className="mb-4 relative">
                            <span className="absolute -top-4 -left-2 text-6xl font-serif opacity-10" style={{ color: THEME.primary }}>“</span>
                            <p className="text-xl font-serif italic leading-relaxed relative z-10 px-2" style={{ color: THEME.primary }}>
                                {todayTip}
                            </p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2 text-xs font-medium opacity-60 pt-6 border-t border-[#E6D0C0]/50" style={{ color: THEME.secondary }}>
                        <Heart size={12} fill="currentColor" />
                        <span>Curated for you</span>
                     </div>
                </div>
            </div>
        </div>

        {/* Daily Recommendation Section */}
        <div className="mb-12">
            <div className="flex justify-between items-end mb-5 px-1">
                <div>
                    <h3 className="text-2xl font-serif mb-1" style={{ color: THEME.primary }}>Movement for Today</h3>
                    <p className="text-sm text-gray-500">Gentle exercises selected for your stage</p>
                </div>
                <button onClick={() => onViewChange('exercises')} className="group flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80" style={{ color: THEME.secondary }}>
                    View Library <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <DailyRecommendation trimester={1} compact={true} />
        </div>

        {/* Footer Quote */}
        <div className="text-center py-8 border-t border-gray-100 mt-8">
            <p className="font-serif italic text-lg opacity-60" style={{ color: THEME.secondary }}>
                "Balance and comfort, one step at a time."
            </p>
        </div>
    </div>
  );
};

const PlannerSection = ({ user }) => {
  const [activeTrimester, setActiveTrimester] = useState(1);
  const [weekCount, setWeekCount] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [weeklyPlan, setWeeklyPlan] = useState({
    Mon: { activity: '', notes: '', done: false },
    Tue: { activity: '', notes: '', done: false },
    Wed: { activity: '', notes: '', done: false },
    Thu: { activity: '', notes: '', done: false },
    Fri: { activity: '', notes: '', done: false },
    Sat: { activity: '', notes: '', done: false },
    Sun: { activity: '', notes: '', done: false },
  });

  const [history, setHistory] = useState([]);

  // --- Persistence for Planner ---
    useEffect(() => {
      if(user?.email) {
        const savedPlanner = localStorage.getItem(`${user.email}_planner_${activeTrimester}`);
        const savedHistory = localStorage.getItem(`${user.email}_history`);
          
        if (savedPlanner) setWeeklyPlan(JSON.parse(savedPlanner));
        else {
          const suggestions = TRIMESTER_CONTENT[activeTrimester].dailyFocus;
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const newPlan = {};
          days.forEach((day, idx) => {
          newPlan[day] = { activity: suggestions[idx] || '', notes: '', done: false };
          });
          setWeeklyPlan(newPlan);
        }

        if (savedHistory) setHistory(JSON.parse(savedHistory));
        setIsLoaded(true); // Mark data as loaded
      }
    }, [user, activeTrimester]);

  // Save planner data
    useEffect(() => {
      if(user?.email && isLoaded) {
        localStorage.setItem(`${user.email}_planner_${activeTrimester}`, JSON.stringify(weeklyPlan));
      }
    }, [weeklyPlan, user, activeTrimester, isLoaded]);

  // Save history
    useEffect(() => {
      if(user?.email && isLoaded) {
        localStorage.setItem(`${user.email}_history`, JSON.stringify(history));
      }
    }, [history, user, isLoaded]);

  const handleInputChange = (day, field, value) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const toggleDone = (day) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], done: !prev[day].done }
    }));
  };

  const completeWeek = () => {
    // Robust unique ID generation
    const uniqueId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const record = {
      id: uniqueId,
      week: weekCount,
      trimester: activeTrimester,
      data: weeklyPlan,
      date: new Date().toLocaleDateString()
    };
    setHistory([record, ...history]);
    setWeekCount(prev => prev + 1);
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const resetPlan = {};
    days.forEach(day => resetPlan[day] = { activity: weeklyPlan[day].activity, notes: '', done: false });
    setWeeklyPlan(resetPlan);
    
    setToastMessage("Week saved successfully!");
  };

  const deleteHistoryEntry = (id) => {
    console.log("Attempting to delete entry with ID:", id);
    if (window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      setHistory(prev => prev.filter(record => record.id !== id));
      setToastMessage("Entry deleted successfully");
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const content = TRIMESTER_CONTENT[activeTrimester];

  if (showHistory) {
     return (
       <>
         <HistoryView history={history} onDelete={deleteHistoryEntry} onBack={() => setShowHistory(false)} />
         <Toast message={toastMessage} onClose={() => setToastMessage('')} />
       </>
     );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 print:hidden gap-4">
        <div>
          <h2 className="text-3xl font-serif mb-1" style={{ color: THEME.primary }}>My Planner</h2>
          <p className="text-sm text-gray-500">Design your weekly flow</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:bg-white hover:shadow-sm"
            style={{ borderColor: THEME.accent, color: THEME.secondary }}
          >
            <History size={16} /> Past Weeks
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all hover:opacity-90 hover:shadow-sm"
            style={{ backgroundColor: THEME.secondary }}
          >
            <Printer size={16} /> Print View
          </button>
        </div>
      </div>

      {/* Trimester Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-8 print:hidden max-w-md">
        {[1, 2, 3].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTrimester(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTrimester === t ? 'bg-white shadow-sm' : 'hover:bg-gray-200/50'}`}
              style={{ 
                color: activeTrimester === t ? THEME.primary : 'gray'
              }}
            >
              Trimester {t}
            </button>
          ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border print:shadow-none print:border-0 print:p-0" style={{ borderColor: THEME.accent }}>
        {/* Dynamic Focus Area */}
        <div className="mb-8 p-6 rounded-xl relative overflow-hidden" style={{ backgroundColor: THEME.highlight }}>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Current Focus</span>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-white/50 rounded text-gray-600">{content.range}</span>
              </div>
              <h3 className="font-serif text-2xl mb-2" style={{ color: THEME.primary }}>Trimester {activeTrimester} Goals</h3>
              <p className="text-sm opacity-90 leading-relaxed max-w-xl mb-4">{content.focus}</p>
              <div className="flex flex-wrap gap-2">
                {content.tips.map((tip, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1 bg-white/80 rounded-full text-gray-700 flex items-center gap-1">
                    <CheckCircle2 size={10} color={THEME.success}/> {tip}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right bg-white/40 p-3 rounded-lg backdrop-blur-sm">
               <span className="text-xs font-bold uppercase text-gray-500 block mb-1">Current Progress</span>
               <span className="text-2xl font-serif" style={{ color: THEME.primary }}>Week {weekCount}</span>
            </div>
          </div>
        </div>

        {/* Weekly Routine Table */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
             <h3 className="font-serif text-xl flex items-center gap-2" style={{ color: THEME.primary }}>
              <Calendar size={20} /> Weekly Blueprint
            </h3>
            <button 
              onClick={completeWeek}
              className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-700 transition-colors border border-transparent hover:border-green-200" 
              style={{ color: THEME.secondary }}
            >
              <RefreshCw size={12}/> Complete Week
            </button>
          </div>
          
          <div className="border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: THEME.accent }}>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-4 text-left font-medium w-20 text-center">Status</th>
                  <th className="p-4 text-left font-medium w-24">Day</th>
                  <th className="p-4 text-left font-medium">Activity</th>
                  <th className="p-4 text-left font-medium w-1/3">Reflections</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {days.map(day => (
                  <tr key={day} className={`group transition-colors ${weeklyPlan[day].done ? 'bg-green-50/30' : 'hover:bg-gray-50'}`}>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleDone(day)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto transition-all duration-300 ${weeklyPlan[day].done ? 'bg-green-600 border-green-600 text-white scale-110' : 'border-gray-300 text-transparent hover:border-green-400'}`}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{day}</td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        className="w-full bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300 transition-colors pb-1 placeholder-gray-300"
                        placeholder={TRIMESTER_CONTENT[activeTrimester].dailyFocus[days.indexOf(day)]}
                        value={weeklyPlan[day].activity}
                        onChange={(e) => handleInputChange(day, 'activity', e.target.value)}
                      />
                    </td>
                    <td className="p-4">
                      <input 
                         type="text" 
                         className="w-full bg-transparent focus:outline-none text-gray-500 italic placeholder-gray-200"
                         placeholder="Add notes..."
                         value={weeklyPlan[day].notes}
                         onChange={(e) => handleInputChange(day, 'notes', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryView = ({ history, onDelete, onBack }) => (
  <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight className="rotate-180"/></button>
        <h2 className="text-2xl font-serif" style={{ color: THEME.primary }}>Routine History</h2>
      </div>
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">No completed weeks yet.</div>
        ) : history.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between mb-4 border-b pb-2">
                <h3 className="font-bold text-lg" style={{ color: THEME.primary }}>Week {rec.week} <span className="text-sm font-normal opacity-60 text-gray-500">({rec.date})</span></h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: THEME.highlight }}>Trimester {rec.trimester}</span>
                  <button 
                    onClick={() => onDelete(rec.id)}
                    className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete this entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-xs">
                {Object.entries(rec.data).map(([day, data]) => (
                    <div key={day} className={`p-2 rounded border ${data.done ? 'bg-green-50 border-green-100 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                      <div className="font-bold mb-1">{day}</div>
                      <div className="truncate">{data.activity || '-'}</div>
                    </div>
                ))}
              </div>
          </div>
        ))}
      </div>
  </div>
);

const ExerciseSection = ({ user }) => {
  const [filterTrimester, setFilterTrimester] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [completed, setCompleted] = useState(new Set());

  // --- Persistence for Exercises ---
    useEffect(() => {
      if (user?.email) {
        const savedProgress = localStorage.getItem(`${user.email}_exercises`);
        if (savedProgress) {
          setCompleted(new Set(JSON.parse(savedProgress)));
        }
      }
    }, [user]);

    useEffect(() => {
      if (user?.email) {
        localStorage.setItem(`${user.email}_exercises`, JSON.stringify(Array.from(completed)));
      }
    }, [completed, user]);

  const toggleComplete = (id) => {
    const newSet = new Set(completed);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCompleted(newSet);
  };

  const filteredExercises = EXERCISES.filter(ex => {
    const matchTrimester = filterTrimester === 'All' || ex.trimester === filterTrimester || ex.trimester === 'All';
    const matchCategory = filterCategory === 'All' || ex.category === filterCategory;
    return matchTrimester && matchCategory;
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-serif mb-2" style={{ color: THEME.primary }}>Guided Movement</h2>
          <p className="text-sm text-gray-500">Curated sessions for every stage</p>
        </div>
        
        <div className="flex flex-col gap-3 items-end">
           {/* Category Filter */}
           <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm" style={{ borderColor: THEME.accent }}>
             {['All', 'Mobility', 'Strength', 'Relaxation'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setFilterCategory(cat)}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterCategory === cat ? 'bg-stone-800 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                 style={{ backgroundColor: filterCategory === cat ? THEME.secondary : '' }}
               >
                 {cat}
               </button>
             ))}
           </div>

           {/* Trimester Filter */}
           <div className="flex gap-2">
             {['All', '1st', '2nd', '3rd'].map(tri => (
               <button
                 key={tri}
                 onClick={() => setFilterTrimester(tri)}
                 className={`px-3 py-1 rounded-full text-xs border transition-colors ${filterTrimester === tri ? 'bg-white border-stone-400 text-stone-800 font-medium' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                 {tri === 'All' ? 'All Trimesters' : `${tri} Trimester`}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 flex items-center gap-4 bg-white p-4 rounded-xl border border-dashed border-gray-200">
         <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <Trophy size={20} />
         </div>
         <div className="flex-1">
            <div className="flex justify-between text-xs mb-2">
               <span className="font-medium text-gray-600">Session Progress</span>
               <span className="font-bold" style={{ color: THEME.primary }}>{completed.size} / {EXERCISES.length} Completed</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
               <div 
                 className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                 style={{ width: `${(completed.size / EXERCISES.length) * 100}%`, backgroundColor: THEME.success }}
               ></div>
            </div>
         </div>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No exercises found for this selection.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExercises.map((ex) => (
            <div key={ex.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border group" style={{ borderColor: completed.has(ex.id) ? THEME.success : 'transparent' }}>
              <div className="relative aspect-video bg-gray-100 cursor-pointer overflow-hidden">
                <img src={ex.thumbnail} alt={ex.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Play size={24} fill={THEME.primary} stroke="none" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {ex.duration}
                </div>
                {completed.has(ex.id) && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                     <CheckCircle2 size={10} /> DONE
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <h3 className="font-serif text-lg leading-tight mb-1" style={{ color: THEME.primary }}>{ex.title}</h3>
                      <p className="text-xs text-gray-500">{ex.category}</p>
                   </div>
                   <button 
                     onClick={() => toggleComplete(ex.id)}
                     className={`p-2 rounded-full transition-colors ${completed.has(ex.id) ? 'text-green-600 bg-green-50' : 'text-gray-300 hover:bg-gray-50 hover:text-gray-400'}`}
                     title="Mark as Complete"
                   >
                     <CheckCircle2 size={20} />
                   </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                   <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium">
                     {ex.trimester === 'All' ? 'All Stages' : `${ex.trimester} Tri`}
                   </span>
                   <span className="text-[10px] px-2 py-1 rounded border text-gray-500" style={{ borderColor: THEME.accent }}>
                     Focus: {ex.focus}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview'); // Default to Overview

  // Clear progress function
  const handleResetProgress = () => {
        if (window.confirm("Are you sure? This will wipe all your planner data and exercise history.")) {
          localStorage.removeItem(`${user.email}_planner_1`);
          localStorage.removeItem(`${user.email}_planner_2`);
          localStorage.removeItem(`${user.email}_planner_3`);
          localStorage.removeItem(`${user.email}_history`);
          localStorage.removeItem(`${user.email}_exercises`);
          window.location.reload(); // Reload to refresh state
        }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: THEME.bg }}>
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 fixed h-full border-r bg-white z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="p-10 pb-8">
           <h2 className="font-serif text-3xl italic tracking-tight" style={{ color: THEME.primary }}>Wellness.</h2>
        </div>
        
        <nav className="flex-1 px-6 space-y-3">
          <button 
            onClick={() => setActiveView('overview')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'overview' ? 'bg-[#F5E6DA] shadow-sm translate-x-1' : 'hover:bg-gray-50 text-gray-500'}`}
            style={{ color: activeView === 'overview' ? THEME.primary : '' }}
          >
            <Home size={20} strokeWidth={activeView === 'overview' ? 2.5 : 2} />
            <span className={`text-sm ${activeView === 'overview' ? 'font-bold' : 'font-medium'}`}>Home</span>
          </button>

          <button 
            onClick={() => setActiveView('planner')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'planner' ? 'bg-[#F5E6DA] shadow-sm translate-x-1' : 'hover:bg-gray-50 text-gray-500'}`}
            style={{ color: activeView === 'planner' ? THEME.primary : '' }}
          >
            <Calendar size={20} strokeWidth={activeView === 'planner' ? 2.5 : 2} />
            <span className={`text-sm ${activeView === 'planner' ? 'font-bold' : 'font-medium'}`}>My Planner</span>
          </button>
          
          <button 
            onClick={() => setActiveView('exercises')}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'exercises' ? 'bg-[#F5E6DA] shadow-sm translate-x-1' : 'hover:bg-gray-50 text-gray-500'}`}
            style={{ color: activeView === 'exercises' ? THEME.primary : '' }}
          >
            <Activity size={20} strokeWidth={activeView === 'exercises' ? 2.5 : 2} />
            <span className={`text-sm ${activeView === 'exercises' ? 'font-bold' : 'font-medium'}`}>Exercises</span>
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50">
           <div className="flex items-center gap-3 mb-6 px-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold uppercase">
                  {user.name.charAt(0)}
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-700">{user.name}</p>
                <p className="text-gray-400 truncate max-w-[120px]">{user.email}</p>
              </div>
           </div>
           
           <div className="space-y-1">
               <button 
                 onClick={handleResetProgress}
                 className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-400 hover:text-amber-600 transition-colors w-full"
               >
                 <RotateCcw size={14} /> Reset Progress
               </button>

               <button 
                 onClick={onLogout}
                 className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-400 hover:text-red-400 transition-colors w-full"
               >
                 <LogOut size={14} /> Sign Out
               </button>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full top-0 bg-white/80 backdrop-blur-md border-b z-20 px-6 py-4 flex justify-between items-center" style={{ borderColor: THEME.accent }}>
         <span className="font-serif text-xl font-bold" style={{ color: THEME.primary }}>Wellness.</span>
         <button onClick={onLogout} className="p-2 bg-gray-50 rounded-full"><LogOut size={16} color={THEME.primary}/></button>
      </div>
      
      {/* Bottom Nav Mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t z-20 flex justify-around py-3 pb-safe" style={{ borderColor: THEME.accent }}>
         <button onClick={() => setActiveView('overview')} className={`flex flex-col items-center text-[10px] gap-1 transition-all ${activeView === 'overview' ? 'opacity-100 scale-105' : 'opacity-50'}`} style={{ color: THEME.primary }}>
           <Home size={22} strokeWidth={2.5} /> Home
         </button>
         <button onClick={() => setActiveView('planner')} className={`flex flex-col items-center text-[10px] gap-1 transition-all ${activeView === 'planner' ? 'opacity-100 scale-105' : 'opacity-50'}`} style={{ color: THEME.primary }}>
           <Calendar size={22} strokeWidth={2.5} /> Planner
         </button>
         <button onClick={() => setActiveView('exercises')} className={`flex flex-col items-center text-[10px] gap-1 transition-all ${activeView === 'exercises' ? 'opacity-100 scale-105' : 'opacity-50'}`} style={{ color: THEME.primary }}>
           <Activity size={22} strokeWidth={2.5} /> Exercises
         </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 mt-16 md:mt-0 mb-20 md:mb-0 overflow-y-auto h-screen scroll-smooth">
        {activeView === 'overview' && <OverviewSection user={user} onViewChange={setActiveView} />}
        {activeView === 'planner' && <PlannerSection user={user} />}
        {activeView === 'exercises' && <ExerciseSection user={user} />}
        <div className="h-12"></div> {/* Spacer */}
      </main>

      <WellnessChatbot />
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); 
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
      setUser(userData);
      setCurrentPage('dashboard');
  };

  const handleLogout = () => {
      setUser(null);
      setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'landing' && <WelcomeScreen onNext={() => setCurrentPage('login')} />}
      {currentPage === 'login' && <LoginScreen onLogin={handleLogin} />}
      {currentPage === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} />}
    </>
  );
};

export default App;
