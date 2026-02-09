
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Palette, Wand2, ImageIcon, Type, Download, Loader2, Sparkles, Leaf, ShieldCheck } from 'lucide-react';

const OliPackStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'content'>('visual');
  const [loading, setLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const generatePrototype = async () => {
    if (loading || !prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A professional cinematic 3D product mockup of ${prompt}. The packaging must include the "OliPack" logo and brand name, minimalist design, luxury eco-friendly look, emerald green and matte white materials, 8k resolution, studio lighting.` }] }
      });

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setImageResult(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération visuelle.");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (loading || !prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rédige une description marketing premium pour un produit de luxe de la marque OliPack (startup marocaine spécialisée dans le bioplastique). Le produit est: ${prompt}. Utilise un ton élégant, professionnel et insiste sur la signature "OliPack : Du déchet noir à l'or vert".`,
      });
      setTextResult(response.text || "Erreur de génération.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération textuelle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
               <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">OliPack Studio</h1>
          </div>
          <p className="text-slate-500">Conception de prototypes et marketing pour la gamme de produits.</p>
        </div>
        
        <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
          <button 
            onClick={() => { setActiveTab('visual'); setImageResult(null); setTextResult(null); }} 
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'visual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Design Produit
          </button>
          <button 
            onClick={() => { setActiveTab('content'); setImageResult(null); setTextResult(null); }} 
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'content' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Rédaction Marketing
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CONFIGURATION SIDE */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-bold">Laboratoire de Création</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description du prototype</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeTab === 'visual' ? "Ex: Flacon de cosmétique en bioplastique OliPack..." : "Ex: Présentation de notre nouvelle gamme de bio-charbon..."}
                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none shadow-inner"
              />
            </div>

            <button
              onClick={activeTab === 'visual' ? generatePrototype : generateContent}
              disabled={loading || !prompt}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {loading ? 'CRÉATION EN COURS...' : 'GÉNÉRER AVEC OLIPACK AI'}
            </button>
          </div>
        </div>

        {/* PREVIEW SIDE - WITH BRANDING */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* BRANDED HEADER */}
          <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                 <Leaf className="w-4 h-4 text-emerald-600" />
               </div>
               <span className="font-bold text-slate-800 tracking-tight">OliPack <span className="text-emerald-500 italic">Studio™</span></span>
            </div>
            { (imageResult || textResult) && (
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-emerald-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/30 relative">
            {activeTab === 'visual' ? (
              imageResult ? (
                <div className="relative group animate-in zoom-in-95 duration-500">
                  <img src={imageResult} alt="Prototype OliPack" className="max-w-full max-h-[400px] rounded-2xl shadow-2xl border-4 border-white" />
                  {/* WATERMARK */}
                  <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none">
                     <p className="text-[10px] font-bold text-white uppercase tracking-widest">Prototype Officiel OliPack</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-20">
                  <ImageIcon className="w-20 h-20 mx-auto text-slate-400" />
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Attente de conception visuelle</p>
                </div>
              )
            ) : (
              textResult ? (
                <div className="w-full max-h-[400px] overflow-y-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-inner animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                     <ShieldCheck className="w-5 h-5 text-emerald-500" />
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Rédaction Approuvée OliPack</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{textResult}</p>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-20">
                  <Type className="w-20 h-20 mx-auto text-slate-400" />
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Attente de rédaction marketing</p>
                </div>
              )
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
             <div className="flex items-center gap-2 opacity-40">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold uppercase">Eco-Conçu</span>
             </div>
             <div className="flex items-center gap-2 opacity-40">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold uppercase">Innovation 2025</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OliPackStudio;
