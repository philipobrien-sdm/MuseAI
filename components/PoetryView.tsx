import React, { useState } from 'react';
import { ImageFile, PoemResult } from '../types';
import { generatePoem, generateSpeech } from '../services/gemini';
import { playPcmAudio } from '../utils/audio';

interface PoetryViewProps {
  image: ImageFile | null;
}

const PoetryView: React.FC<PoetryViewProps> = ({ image }) => {
  const [feelings, setFeelings] = useState('');
  const [style, setStyle] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [poem, setPoem] = useState<PoemResult | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setPoem(null);
    try {
      const result = await generatePoem(
        image, 
        feelings || "A sense of wonder and mystery",
        style,
        intensity
      );
      setPoem(result);
    } catch (e) {
      alert("Failed to generate poem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = async () => {
    if (!poem) return;
    setPlayingAudio(true);
    try {
      const audioBase64 = await generateSpeech(`${poem.title}. \n ${poem.content}`);
      await playPcmAudio(audioBase64);
    } catch (e) {
      alert("Failed to generate speech.");
    } finally {
      setPlayingAudio(false);
    }
  };

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <span className="material-symbols-rounded text-6xl mb-4">image</span>
        <p>Please upload an image to start your poetic journey.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          
          {/* Thoughts */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="material-symbols-rounded text-indigo-500 text-lg">psychology</span>
              Inspiration & Thoughts
            </h3>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-slate-700 bg-slate-50"
              rows={3}
              placeholder="How does this image make you feel? What memories does it evoke?"
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Style */}
             <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <span className="material-symbols-rounded text-indigo-500 text-lg">history_edu</span>
                  Style
                </h3>
                <input 
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 bg-slate-50"
                  placeholder="e.g. Haiku, Sonnet, Dark..."
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  disabled={loading}
                />
             </div>

             {/* Intensity */}
             <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <span className="material-symbols-rounded text-indigo-500 text-lg">tune</span>
                  Intensity: <span className="text-indigo-600 ml-auto">{intensity}</span>
                </h3>
                <div className="px-1 py-2">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={intensity} 
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                    <span>Subtle</span>
                    <span>Intense</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-medium text-white shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/30'}`}
        >
          {loading ? (
            <>
              <span className="material-symbols-rounded animate-spin">refresh</span>
              Crafting Verses...
            </>
          ) : (
            <>
              <span className="material-symbols-rounded">auto_awesome</span>
              Write Poem
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10">
             <div className="flex flex-col items-center gap-3">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-indigo-600 font-medium animate-pulse">Consulting the Muses...</p>
             </div>
          </div>
        )}
        
        {poem ? (
           <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 h-full flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400"></div>
             
             <div>
                <h2 className="font-serif text-3xl font-bold text-slate-800 mb-6 text-center leading-tight">
                  {poem.title}
                </h2>
                <div className="font-serif text-lg text-slate-600 whitespace-pre-line leading-relaxed text-center">
                  {poem.content}
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                <button
                  onClick={handleReadAloud}
                  disabled={playingAudio}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors
                    ${playingAudio 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  <span className="material-symbols-rounded">
                    {playingAudio ? 'volume_up' : 'text_to_speech'}
                  </span>
                  {playingAudio ? 'Playing...' : 'Read Aloud'}
                </button>
             </div>
           </div>
        ) : (
          <div className="h-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
             <div className="text-center">
               <span className="material-symbols-rounded text-5xl mb-2 opacity-50">import_contacts</span>
               <p>Your poem will appear here</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoetryView;