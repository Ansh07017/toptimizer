
import React, { useState } from 'react';
import { FileUp, Loader2, Sparkles, CheckCircle, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface SyllabusProcessorProps {
  onPathwayGenerated: (nodes: any[], links: any[]) => void;
}

const SyllabusProcessor: React.FC<SyllabusProcessorProps> = ({ onPathwayGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const processSyllabus = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatus('analyzing');

    try {
      const prompt = `
        Act as a curriculum engineer. I have a syllabus for a subject named "${file.name}".
        Generate a structured data graph (Nodes and Links) for academic mastery.
        Return a JSON object:
        {
          "nodes": [
            {"id": "t1", "label": "Topic Name", "type": "topic", "status": "pending", "difficulty": 5, "cognitiveLoad": 40, "importance": 1.2},
            ...
          ],
          "links": [
            {"source": "t1", "target": "t2", "value": 5},
            ...
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING },
                    status: { type: Type.STRING },
                    difficulty: { type: Type.NUMBER },
                    cognitiveLoad: { type: Type.NUMBER },
                    importance: { type: Type.NUMBER }
                  },
                  required: ["id", "label", "type", "status", "difficulty", "cognitiveLoad", "importance"]
                }
              },
              links: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    target: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                  },
                  required: ["source", "target", "value"]
                }
              }
            },
            required: ["nodes", "links"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      onPathwayGenerated(data.nodes, data.links);
      setStatus('complete');
    } catch (error) {
      console.error("Syllabus Analysis Error:", error);
      setStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700 pb-20 max-w-4xl mx-auto">
      <header className="text-center">
         <div className="inline-block p-6 bg-white/5 text-violet-500 rounded-[2.5rem] border border-white/5 mb-8">
            <BookOpen size={48} />
         </div>
         <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Curriculum Analysis</h2>
         <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Convert Academic Documents into Optimized Execution Hierarchies</p>
      </header>

      <div className="frosted-obsidian p-12 lg:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden">
         {!file ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-[3rem] group hover:border-violet-500/50 transition-all cursor-pointer relative bg-black/20">
               <input 
                 type="file" 
                 accept=".pdf" 
                 onChange={handleFileChange}
                 className="absolute inset-0 opacity-0 cursor-pointer"
               />
               <FileUp size={64} className="text-slate-700 group-hover:text-violet-500 transition-colors mb-6" />
               <p className="text-lg font-black text-white uppercase tracking-widest">Select Syllabus PDF</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Maximum Payload: 25MB // PDF_FORMAT</p>
            </div>
         ) : (
            <div className="space-y-10 relative z-10">
               <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-white/5 text-rose-500 rounded-2xl border border-white/5"><FileUp size={32} /></div>
                     <div>
                        <p className="text-xl font-black text-white uppercase tracking-tight">{file.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB // STATUS_READY</p>
                     </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">Clear Input</button>
               </div>

               {status === 'analyzing' && (
                  <div className="p-10 bg-violet-600/10 rounded-[2.5rem] border border-violet-500/20 flex flex-col items-center text-center gap-6">
                     <Loader2 className="animate-spin text-violet-500" size={48} />
                     <div>
                        <p className="text-lg font-black text-white uppercase tracking-widest">Initializing Logic Engine...</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Processing document structure and dependency mapping</p>
                     </div>
                  </div>
               )}

               {status === 'complete' && (
                  <div className="p-10 bg-lime-500/10 rounded-[2.5rem] border border-lime-500/20 flex items-center gap-8">
                     <div className="p-5 bg-lime-500 text-black rounded-3xl"><CheckCircle size={32} /></div>
                     <div>
                        <p className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">Analysis Complete</p>
                        <p className="text-slate-400 font-medium text-sm mt-2">Execution sequence generated with optimized workload weights.</p>
                     </div>
                  </div>
               )}

               {status === 'idle' && (
                  <button 
                    onClick={processSyllabus}
                    className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] hover:bg-violet-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-6"
                  >
                    <Sparkles /> Run System Analysis
                  </button>
               )}
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="frosted-obsidian p-8 rounded-[3rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-4 text-violet-400">
               <AlertCircle size={20} />
               <h4 className="text-xs font-black uppercase tracking-widest">Precedence Mapping</h4>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">The analyzer identifies foundational modules required prior to specialized advancing.</p>
         </div>
         <div className="frosted-obsidian p-8 rounded-[3rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-4 text-lime-400">
               <TrendingUp size={20} />
               <h4 className="text-xs font-black uppercase tracking-widest">Weight Distribution</h4>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">Each academic unit is assigned a difficulty metric based on documented curriculum complexity.</p>
         </div>
      </div>
    </div>
  );
};

export default SyllabusProcessor;
