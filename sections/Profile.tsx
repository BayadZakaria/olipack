
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Save, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Camera,
  ChevronDown
} from 'lucide-react';
import { db } from '../services/db';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    cin: user.cin || '',
    telephone: user.telephone || '',
    fonction: user.fonction || 'Partenaire OliPack'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Options de fonctions adaptées au projet OliPack
  const fonctionOptions = [
    "CEO & Fondateur",
    "Directeur Technique (CTO)",
    "Propriétaire de Maâssra",
    "Responsable Qualité Bio-Chimie",
    "Technicien Maintenance IoT",
    "Gestionnaire Logistique",
    "Agent de Collecte",
    "Analyste Impact Environnemental",
    "Partenaire Investisseur",
    "Consultant GreenTech"
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const userId = user.id || 'mock-id';
      const updated = await db.updateProfile(userId, formData);
      if (updated) {
        onUpdate({ ...user, ...formData });
        setMessage({ type: 'success', text: "Profil OliPack mis à jour avec succès." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Erreur lors de la mise à jour." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const userId = user.id || 'mock-id';
      await db.deleteAccount(userId);
      onLogout();
    } catch (error) {
      setMessage({ type: 'error', text: "Erreur lors de la suppression." });
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mon Profil OliPack</h1>
          <p className="text-slate-500">Gérez vos informations et la sécurité de votre accès.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
          user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {user.role}
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AVATAR & STATS */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-emerald-200">
                {user.prenom.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg text-emerald-600 hover:text-emerald-700 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.prenom} {user.nom}</h2>
            <p className="text-sm text-slate-400 font-medium">{user.email}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membre depuis</p>
                <p className="text-sm font-bold text-slate-700">2025</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lots certifiés</p>
                <p className="text-sm font-bold text-slate-700">12</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <Shield className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10" />
             <div className="relative z-10 space-y-4">
               <h3 className="font-bold flex items-center gap-2">
                 <Shield className="w-5 h-5 text-emerald-400" /> Sécurité du Compte
               </h3>
               <p className="text-xs text-emerald-100/60 leading-relaxed">
                 Vos données sont chiffrées de bout en bout et hébergées sur les serveurs sécurisés d'OliPack Cloud.
               </p>
               <button type="button" className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/10">
                 Modifier le mot de passe
               </button>
             </div>
          </div>
        </div>

        {/* PROFILE FORM */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
               <User className="text-emerald-600 w-6 h-6" />
               <h2 className="text-xl font-bold text-slate-800">Informations Personnelles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de famille</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro CIN</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={formData.cin}
                    onChange={(e) => setFormData({...formData, cin: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="tel" 
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SÉLECTION DE LA FONCTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fonction / Poste au sein d'OliPack</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <select 
                  value={formData.fonction}
                  onChange={(e) => setFormData({...formData, fonction: e.target.value})}
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                >
                  <option disabled value="">Sélectionnez votre poste...</option>
                  {fonctionOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                SAUVEGARDER LES MODIFICATIONS
              </button>
            </div>
          </form>

          {/* DANGER ZONE */}
          <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100 space-y-6">
            <div className="flex items-center gap-3">
               <AlertCircle className="text-red-600 w-6 h-6" />
               <h2 className="text-xl font-bold text-red-800">Zone de Danger</h2>
            </div>
            
            <p className="text-sm text-red-700 leading-relaxed font-medium">
              La suppression de votre compte est irréversible. Toutes vos données de traçabilité, vos prototypes studio et votre historique de bio-qualité seront définitivement effacés de nos serveurs.
            </p>

            {showDeleteConfirm ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-2">
                <p className="text-xs font-black text-red-900 uppercase tracking-widest text-center">Êtes-vous absolument sûr ?</p>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-4 bg-white border border-red-200 text-red-700 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
                  >
                    ANNULER
                  </button>
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "OUI, SUPPRIMER MON COMPTE"}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-4 border-2 border-dashed border-red-300 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> SUPPRIMER LE COMPTE DÉFINITIVEMENT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
