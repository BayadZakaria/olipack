
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, Bot, User, Loader2, Map, ShieldCheck } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Bonjour Zakaria. Je suis votre copilote OliPack. Je peux vous aider à optimiser vos tournées de collecte à Beni Mellal ou analyser la stabilité du pH de vos cuves. Que souhaitez-vous faire ?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Vous êtes l'assistant IA d'OliPack, une startup GreenTech marocaine. Fondateur : Zakaria Bayad. 
          Expertise : 1. Logistique margines. 2. IoT monitoring. 3. Valorisation en pellets et PHA. 
          Répondez de manière professionnelle et axée sur l'impact environnemental au Maroc.`
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Erreur de génération." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion à l'IA." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Sparkles className="text-emerald-500" /> OliPack AI</h1>
          <p className="text-slate-500">Supervision intelligente des opérations</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-100' : 'bg-emerald-100 text-emerald-600'}`}>
                {m.role === 'user' ? <User className="w-5 h-5 text-slate-500" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700 border border-slate-100'}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="animate-pulse flex gap-2 text-slate-400 text-xs items-center"><Loader2 className="animate-spin w-4 h-4" /> L'IA analyse les flux...</div>}
      </div>

      <div className="mt-6 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ex: Optimise le trajet pour Beni Mellal..."
          className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
        <button onClick={sendMessage} className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg"><Send /></button>
      </div>
    </div>
  );
};

export default AIAssistant;
