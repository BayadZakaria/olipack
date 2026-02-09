
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Link as LinkIcon, 
  Unlink, 
  Activity, 
  Signal, 
  Battery, 
  RefreshCcw,
  Search,
  Plus,
  Settings2,
  AlertCircle
} from 'lucide-react';

interface MaâsraSite {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'pending' | 'error';
  linkedDeviceId: string | null;
  lastSync: string;
}

const AdminControl: React.FC = () => {
  const [sites, setSites] = useState<MaâsraSite[]>([
    { id: 'S1', name: 'Maâsra El Baraka', location: 'Beni Mellal', status: 'active', linkedDeviceId: 'OP-001', lastSync: 'Il y a 2 min' },
    { id: 'S2', name: 'Huilerie du Nord', location: 'Meknès', status: 'pending', linkedDeviceId: null, lastSync: 'Jamais' },
    { id: 'S3', name: 'Atlas Olive', location: 'Marrakech', status: 'error', linkedDeviceId: 'OP-003', lastSync: 'Il y a 5h' },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const linkDevice = (siteId: string) => {
    const deviceId = prompt("Entrez l'ID du boîtier OliPack Connect (ex: OP-002):");
    if (deviceId) {
      setSites(prev => prev.map(s => s.id === siteId ? { ...s, linkedDeviceId: deviceId, status: 'active', lastSync: 'À l\'instant' } : s));
    }
  };

  const unlinkDevice = (siteId: string) => {
    if (confirm("Voulez-vous vraiment déconnecter ce boîtier ?")) {
      setSites(prev => prev.map(s => s.id === siteId ? { ...s, linkedDeviceId: null, status: 'pending' } : s));
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="text-amber-500" />
            Supervision de la Flotte
          </h1>
          <p className="text-slate-500">Gestion et appairage des boîtiers OliPack Connect aux Maâsras.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncAll}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Forcer Sync
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Plus className="w-4 h-4" />
            Nouveau Site
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sites.map(site => (
          <div key={site.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className={`p-4 ${site.status === 'active' ? 'bg-emerald-50' : site.status === 'error' ? 'bg-red-50' : 'bg-slate-50'} flex justify-between items-center border-b border-slate-100`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${site.status === 'active' ? 'bg-emerald-500 animate-pulse' : site.status === 'error' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${site.status === 'active' ? 'text-emerald-700' : site.status === 'error' ? 'text-red-700' : 'text-slate-500'}`}>
                  {site.status === 'active' ? 'Connecté' : site.status === 'error' ? 'Erreur Hardware' : 'En attente'}
                </span>
              </div>
              <button className="p-1.5 hover:bg-white/50 rounded-lg transition-colors text-slate-400">
                <Settings2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{site.name}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {site.location}, Maroc
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Matériel Associé</span>
                  {site.linkedDeviceId && (
                    <span className="text-[10px] font-mono font-bold bg-slate-200 px-2 py-0.5 rounded uppercase">{site.linkedDeviceId}</span>
                  )}
                </div>

                {site.linkedDeviceId ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Signal className="w-3 h-3 text-emerald-500" /> Signal 4G
                      </div>
                      <span className="font-bold">84%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Battery className="w-3 h-3 text-orange-500" /> Batterie
                      </div>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button 
                        onClick={() => unlinkDevice(site.id)}
                        className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-red-50 transition-colors"
                      >
                        <Unlink className="w-3 h-3" /> Déconnecter
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-slate-900 transition-colors">
                        <Activity className="w-3 h-3" /> Diagnostic
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl gap-2">
                    <AlertCircle className="w-6 h-6 text-slate-300" />
                    <button 
                      onClick={() => linkDevice(site.id)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" /> Associer un Boîtier
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Dernière Sync Cloud</span>
                <span className="font-medium text-slate-500">{site.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-amber-50 border border-amber-100 rounded-3xl p-8">
        <div className="flex gap-6 items-start">
          <div className="bg-amber-500 p-4 rounded-2xl text-white shadow-lg shadow-amber-200">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-amber-900">Protocole de Sécurité Hardware</h2>
            <p className="text-sm text-amber-800 leading-relaxed max-w-3xl">
              Chaque boîtier OliPack Connect possède un identifiant unique (UUID) stocké en dur dans le firmware. 
              Pour des raisons de traçabilité, un boîtier ne peut être associé qu'à une seule Maâsra à la fois. 
              En cas d'anomalie sur le pH ou la température pendant plus de 30 min, une notification PUSH est envoyée au technicien de zone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminControl;
