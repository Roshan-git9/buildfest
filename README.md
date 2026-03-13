# Rhythm Flow - Local Hosting Guide

This application is a high-fidelity AI sensing layer for educators. It uses real student datasets to monitor learning drift and provide insights.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Google Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com/app/apikey))

## Getting Started

1. **Extract the project files** into a directory of your choice.
2. **Open a terminal** (Command Prompt, PowerShell, or Terminal) and navigate to that directory.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Configure your API Key**:
   - Create a file named `.env` in the root directory.
   - Add the following line to the file:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```
6. **Open your browser** and go to `http://localhost:3000`.

## Using the Dataset

The application is pre-loaded with the student dataset you provided. 
- On the first run, it will automatically populate the registry with entries like Aarav, Meera, Ishaan, etc.
- You can view their specific lifestyle metrics (Screen Time, Sleep, Physical Activity) in the **Progress** portal.
- The AI insights are generated in real-time based on these metrics.

## Production Build

To build the app for production:
```bash
npm run build
```
The optimized files will be in the `dist/` folder, which can be served by any static web server.
