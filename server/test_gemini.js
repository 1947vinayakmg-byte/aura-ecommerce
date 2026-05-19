const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyCDtsY5bQtkUAD1tkMtdmgrzENJEpRdzwg" }); // Using the key from .env

async function test() {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: "Hello world!",
    });
    console.log(response.text);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}
test();
