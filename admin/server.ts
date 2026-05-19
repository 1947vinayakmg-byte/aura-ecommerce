import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // AI Sales Insights Endpoint
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { data } = req.body; // Expecting some recent sales/traffic stats
      const prompt = `Analyze this luxury fashion store data and provide 3 executive-level insights for the store director. Focus on luxury branding, inventory optimization, and customer retention. Keep it sophisticated and professional.
      Data: ${JSON.stringify(data)}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      res.json({ insights: response.text });
    } catch (error) {
      console.error("AI Insight Error:", error);
      res.status(500).json({ error: "Failed to generate luxury insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Dashboard running on http://localhost:${PORT}`);
  });
}

startServer();
