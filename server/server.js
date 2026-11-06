import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("InterviewAI server is running");
});

app.post("/feedback", async (req, res) => {
  try {
    const { question, answer, role } = req.body;

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `You are an interview coach. Give concise, helpful feedback on this answer.
Job role: ${role}
Interview question: ${question}
Candidate answer: ${answer}`,
    });

    res.json({ feedback: response.text });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log("InterviewAI server is running at http://localhost:3001");
});