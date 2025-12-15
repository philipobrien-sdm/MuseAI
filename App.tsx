import React, { useState, useRef } from 'react';
import { Tab, ImageFile } from './types';
import PoetryView from './components/PoetryView';
import AnalyzerView from './components/AnalyzerView';
import ChatView from './components/ChatView';
import { processImage } from './utils/imageProcessing';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.POETRY);
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
      }

      setIsProcessing(true);
      try {
        // Resize and compress image before setting state
        const processedImage = await processImage(file);
        setImage(processedImage);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try another file.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <span className="material-symbols-rounded text-white text-xl">history_edu</span>
              </div>
              <h1 className="text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
                MuseAI
              </h1>
            </div>
            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveTab(Tab.POETRY)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1.5
                  ${activeTab === Tab.POETRY ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-500 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-rounded text-[18px]">auto_stories</span>
                <span className="hidden sm:inline">Poet</span>
              </button>
              <button
                onClick={() => setActiveTab(Tab.ANALYZE)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1.5
                  ${activeTab === Tab.ANALYZE ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-emerald-500 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-rounded text-[18px]">image_search</span>
                <span className="hidden sm:inline">Analyze</span>
              </button>
              <button
                onClick={() => setActiveTab(Tab.CHAT)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1.5
                  ${activeTab === Tab.CHAT ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-500 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-rounded text-[18px]">forum</span>
                <span className="hidden sm:inline">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Shared Image Uploader - Only show for Poetry and Analyze tabs */}
        {activeTab !== Tab.CHAT && (
          <div className="mb-8 animate-fade-in-down">
            {!image ? (
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`w-full h-48 sm:h-64 border-2 border-dashed border-slate-300 rounded-3xl bg-white transition-colors flex flex-col items-center justify-center gap-4 group
                  ${isProcessing ? 'cursor-wait opacity-70' : 'hover:bg-slate-50 cursor-pointer'}`}
              >
                {isProcessing ? (
                   <div className="flex flex-col items-center gap-3">
                     <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-sm font-medium text-slate-500">Optimizing image...</p>
                   </div>
                ) : (
                  <>
                    <div className="p-4 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                      <span className="material-symbols-rounded text-indigo-500 text-4xl">add_photo_alternate</span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-slate-700">Upload an Image</p>
                      <p className="text-sm text-slate-500 mt-1">Click to browse or drag & drop</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative group rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                <div className="aspect-w-16 aspect-h-9 max-h-[400px] w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={image.preview} alt="Uploaded" className="object-contain w-full h-full max-h-[400px]" />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={clearImage}
                    className="bg-white/90 backdrop-blur text-slate-700 hover:text-red-500 p-2 rounded-full shadow-md transition-colors"
                  >
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                </div>
                {/* Image Badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Image
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isProcessing}
            />
          </div>
        )}

        {/* Dynamic Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === Tab.POETRY && <PoetryView image={image} />}
          {activeTab === Tab.ANALYZE && <AnalyzerView image={image} />}
          {activeTab === Tab.CHAT && (
            <div className="max-w-4xl mx-auto">
               <ChatView />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;