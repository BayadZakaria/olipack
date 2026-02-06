
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Palette, Wand2, ImageIcon, Type, Download, Loader2, Sparkles } from 'lucide-react';

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
        contents: { parts: [{ text: `A cinematic 3D render of a luxury eco-friendly packaging for olive oil cosmetics, made from emerald bioplastic, minimalist design, 8k, professional lighting. Context: ${prompt}` }] }
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
      alert("Erreur lors de la génération visuelle. Vérifiez votre clé API.");
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
        contents: `Rédige une description marketing premium pour un produit de luxe OliPack (bioplastique à base de margines). Le produit est: ${prompt}. Utilise un ton élégant, insiste sur l'aspect GreenTech et l'innovation marocaine.`,
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Palette className="text-emerald-600" /> 
            OliPack Studio
          </h1>
          <p className="text-slate-500">Prototypage rapide de produits et packaging via l'IA.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
          <button 
            onClick={() => { setActiveTab('visual'); setImageResult(null); setTextResult(null); }} 
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'visual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Visualisation 3D
          </button>
          <button 
            onClick={() => { setActiveTab('content'); setImageResult(null); setTextResult(null); }} 
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'content' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Marketing AI
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-amber-500" /> Paramètres Créatifs
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description du produit</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeTab === 'visual' ? "Ex: Flacon de sérum minimaliste en bioplastique vert émeraude avec bouchon en bois..." : "Ex: Savon exfoliant aux grignons d'olive et huiles essentielles..."}
                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none shadow-inner"
              />
            </div>

            <button
              onClick={activeTab === 'visual' ? generatePrototype : generateContent}
              disabled={loading || !prompt}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {loading ? 'GÉNÉRATION EN COURS...' : 'LANCER LA CRÉATION'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Résultat Studio</h2>
            { (imageResult || textResult) && (
              <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/20">
            {activeTab === 'visual' ? (
              imageResult ? (
                <img src={imageResult} alt="Prototype 3D" className="max-w-full max-h-96 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500" />
              ) : (
                <div className="text-center space-y-4 opacity-30">
                  <ImageIcon className="w-20 h-20 mx-auto text-slate-300" />
                  <p className="text-sm font-medium">Votre prototype 3D apparaîtra ici</p>
                </div>
              )
            ) : (
              textResult ? (
                <div className="w-full max-h-96 overflow-y-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-inner animate-in slide-in-from-bottom-4">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{textResult}</p>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-30">
                  <Type className="w-20 h-20 mx-auto text-slate-300" />
                  <p className="text-sm font-medium">Le contenu marketing apparaîtra ici</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OliPackStudio;
