# MuseAI: Visual Poetry & Analysis Suite

<img width="400" height="300" alt="Screenshot 2025-12-15 070743" src="https://github.com/user-attachments/assets/0c35e99c-9738-4e88-a6c3-b527e994fe4f" />
<img width="400" height="300" alt="Screenshot 2025-12-15 070918" src="https://github.com/user-attachments/assets/0e62bba3-0748-449a-816c-4495781734a6" />


MuseAI is an intelligent creative suite that transforms visual inspiration into poetic expression. Powered by Google's Gemini 3.0 Pro, it bridges the gap between visual art and literature, offering tools for poetry generation, detailed image analysis, and creative conversational assistance.

## ✨ Features

### 1. Visual Poetry Generator
- **Image-to-Text Synthesis**: Upload an image to serve as the visual anchor for your poem.
- **Customizable Context**: Input your feelings, specific thoughts, or memories associated with the image.
- **Style Control**: Define the poetic structure (e.g., Haiku, Sonnet, Free Verse, Poet Style (e.g. Bukowski, Seuss, Neruda)).
- **Intensity Slider**: Adjust the emotional weight of the poem from subtle to dramatic.
- **Text-to-Speech (TTS)**: Listen to your generated poem read aloud by a neural voice.

### 2. Deep Image Analysis
- **Computer Vision**: Utilizes multimodal AI to deconstruct images.
- **Insights**: Provides detailed breakdowns of composition, color palettes, mood, and potential symbolism.

### 3. Creative Assistant Chat
- **Context-Aware Bot**: A dedicated chat interface for brainstorming, editing help, or general creative discussions.
- **Gemini 3.0 Pro**: Powered by the latest reasoning models for high-quality interactions.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Models Used**:
  - `gemini-3-pro-preview` (Reasoning, Poetry, Analysis)
  - `gemini-2.5-flash-preview-tts` (Audio generation)
- **Typography**: Inter & Playfair Display via Google Fonts
- **Icons**: Material Symbols Rounded

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/muse-ai.git
   ```

2. **Install dependencies**
   (Note: This project uses ES modules via CDN/ImportMap for a lightweight setup, but can be adapted to Node based workflows).

3. **API Key Configuration**
   The application requires a valid Google Gemini API Key. Ensure `process.env.API_KEY` is accessible in your environment.

4. **Run the Application**
   Serve the `index.html` using a local server (e.g., Live Server, Vite, or Python http.server).

## 🎨 Design Philosophy

MuseAI uses a clean, minimal aesthetic with a "slate" color palette to keep the focus on the user's content. We utilize serif fonts for generated literary content to evoke the feeling of a classic manuscript, contrasted with modern sans-serif fonts for the UI controls.

## 📄 License

MIT License - Copyright (c) 2025
