
import React, { useState, useEffect } from 'react';
import { Leaf, ArrowRight, Mail, Lock, Loader2, Info, Briefcase, Phone, CreditCard, HelpCircle, AlertCircle, Cloud, Monitor, CheckCircle2, FlaskConical, ShieldCheck } from 'lucide-react';
import { db, supabase } from '../services/db';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [isCloud, setIsCloud] = useState(false);

  const [formData, setFormData] = useState<any>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    cin: '',
    telephone: '',
    role: 'HUILERIE' as UserRole
  });

  useEffect(() => {
    setIsCloud(!!supabase);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      if (isSignup) {
        await db.signUp(formData);
        setSuccessMsg("Compte créé localement ! Connectez-vous maintenant.");
        setIsSignup(false);
        setFormData({ ...formData, password: '' });
      } else {
        const user = await db.signIn(formData.email, formData.password);
        if (user) {
          onLogin(user);
        } else {
          throw new Error("Impossible de récupérer votre profil.");
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('Identifiants incorrects')) {
        setErrorMsg("Email ou mot de passe incorrect.");
      } else if (err.message?.includes('Email not confirmed')) {
        setErrorMsg("Email non confirmé. Vérifiez vos mails ou utilisez les comptes de test ci-dessous.");
      } else {
        setErrorMsg(err.message || "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillTestAccount = (role: 'admin' | 'huilerie' | 'technicien') => {
    const accounts: any = {
      admin: { email: 'admin@olipack.ma', password: 'admin' },
      huilerie: { email: 'maassra@olipack.ma', password: 'maassra' },
      technicien: { email: 'tech@olipack.ma', password: 'tech' }
    };
    setFormData({ ...formData, ...accounts[role] });
    setIsSignup(false);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative z-10">
        <div className="bg-emerald-600 p-8 text-white text-center relative">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            {isCloud ? <Cloud className="w-3 h-3 text-emerald-300" /> : <Monitor className="w-3 h-3 text-amber-300" />}
            <span className="text-[8px] font-black uppercase tracking-widest">{isCloud ? 'Cloud Connect' : 'Simulation Locale'}</span>
          </div>
          <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner border border-white/10">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black font-serif italic tracking-tight">OliPack Portal</h1>
          <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-[0.2em] mt-1 opacity-80">Transition Écologique Digitale</p>
        </div>

        {!isCloud && !isSignup && (
          <div className="bg-amber-50 border-b border-amber-100 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-tight">
              <ShieldCheck className="w-4 h-4" /> Mode Simulation : Identifiants de test
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => fillTestAccount('admin')}
                className="py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors shadow-sm"
              >
                Admin (Zakaria)
              </button>
              <button 
                type="button"
                onClick={() => fillTestAccount('huilerie')}
                className="py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors shadow-sm"
              >
                Maâssra
              </button>
              <button 
                type="button"
                onClick={() => fillTestAccount('technicien')}
                className="py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors shadow-sm"
              >
                Technicien
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] font-bold text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] font-bold text-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> {successMsg}
            </div>
          )}

          {isSignup && (
            <div className="grid grid-cols-2 gap-3">
              <input required name="prenom" value={formData.prenom} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Prénom" />
              <input required name="nom" value={formData.nom} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Nom" />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Email professionnel" />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Mot de passe" />
          </div>

          {isSignup && (
            <div className="relative">
              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border rounded-2xl text-sm appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="HUILERIE">Huilerie (Maâssra)</option>
                <option value="ADMIN">Administrateur</option>
                <option value="COLLECTEUR">Collecteur Logistique</option>
                <option value="TECHNICIEN">Technicien Qualité</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isSignup ? "Démarrer l'aventure" : "Accéder à l'Or Vert")}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="px-8 pb-8 text-center">
           <button onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); setSuccessMsg(''); }} className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:text-emerald-800 transition-colors">
            {isSignup ? "Déjà membre d'OliPack ? Se connecter" : "Nouveau partenaire ? Créer un compte"}
           </button>
           
           <div className="mt-8 flex items-center justify-center gap-4 text-slate-300">
             <div className="h-px w-8 bg-slate-100"></div>
             <HelpCircle className="w-4 h-4" />
             <div className="h-px w-8 bg-slate-100"></div>
           </div>
           
           <p className="mt-4 text-[9px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
             Propulsé par OliPack AI & IoT. Pour toute assistance technique : support@olipack.ma
           </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
