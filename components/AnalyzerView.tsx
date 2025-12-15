import React, { useState } from 'react';
import { ImageFile } from '../types';
import { analyzeImage } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface AnalyzerViewProps {
  image: ImageFile | null;
}

const AnalyzerView: React.FC<AnalyzerViewProps> = ({ image }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await analyzeImage(image);
      setAnalysis(result);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <span className="material-symbols-rounded text-6xl mb-4">image</span>
        <p>Upload an image to reveal its secrets.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-rounded text-emerald-500">analytics</span>
            Visual Analysis
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-all
              ${loading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'}`}
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>
        
        <div className="p-8 min-h-[300px]">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ) : analysis ? (
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <span className="material-symbols-rounded text-5xl mb-3 opacity-30">radar</span>
                <p>Click "Analyze Image" to get insights</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzerView;