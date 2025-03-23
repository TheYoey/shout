require("dotenv").config({ path: __dirname + "/.env" });

console.log("📌 ENV File Path:", __dirname + "/.env");
console.log("🔍 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔍 SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "Loaded" : "Missing!");

const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Check if ENV variables are loaded
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.ASSEMBLYAI_API_KEY) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

// ✅ Supabase Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ AssemblyAI Configuration
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: process.env.ASSEMBLYAI_API_KEY,
    "content-type": "application/json",
  },
});

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🔥 Shout AI is up and running!");
});

// ✅ Audio Processing Endpoint
app.post("/process", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No audio file uploaded.");
    console.log("🎙️ Received audio file, uploading to AssemblyAI...");

    // Upload to AssemblyAI
    const uploadResponse = await assembly.post("/upload", req.file.buffer);
    console.log("✅ Audio uploaded successfully.");

    // Start transcription
    const transcription = await assembly.post("/transcript", {
      audio_url: uploadResponse.data.upload_url,
      speaker_labels: true,
    });

    console.log(`🔄 Transcription started: ${transcription.data.id}`);

    // Poll for transcription completion
    let transcriptResult;
    while (true) {
      transcriptResult = await assembly.get(`/transcript/${transcription.data.id}`);
      if (["completed", "error"].includes(transcriptResult.data.status)) break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (transcriptResult.data.status === "error") throw new Error(`Transcription failed: ${transcriptResult.data.error}`);

    console.log("✅ Transcription completed!");

    // Save transcript to Supabase
    const { data, error } = await supabase.from("transcripts").insert([{ text: transcriptResult.data.text }]);
    if (error) throw new Error(`Supabase error: ${error.message}`);

    console.log("✅ Transcript saved to Supabase!");
    res.json({ message: "Transcription saved!", transcript: data });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Processing failed", details: error.message });
  }
});

// ✅ Webhook Handler for AssemblyAI
app.post("/webhook", async (req, res) => {
  try {
    const { transcript_id, status } = req.body;
    if (status === "completed") {
      console.log(`📥 Webhook: Transcription ${transcript_id} completed.`);

      // Retrieve the transcript
      const transcriptResult = await assembly.get(`/transcript/${transcript_id}`);

      // Save to Supabase
      await supabase.from("transcripts").insert([{ text: transcriptResult.data.text }]);

      console.log(`✅ Webhook: Transcript ${transcript_id} saved.`);
    }
    res.send("Webhook received");
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).send("Webhook processing failed");
  }
});

// ✅ Server Setup (Fix Port Conflict)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
