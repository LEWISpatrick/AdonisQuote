require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');  // Using default import for OpenAI

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.use(express.json());

const openai = new OpenAI({  // Adjusted according to typical usage in older versions
    apiKey: process.env.OPENAI_API_KEY,
});

app.options('/generate-quotes', cors());  // Enable pre-flight requests

app.post('/generate-quotes', (req, res) => {
    const prompt = req.body.videoContent;
    openai.Completion.create({  // Assuming 'Completion.create' is the correct method; adjust based on actual API
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 150,
        n: 5,
        stop: ["\n", "\n\n"]
    }).then(response => {
        const quotes = response.choices.map(choice => choice.text.trim());  // Adjust path according to actual response structure
        res.json({ quotes });
    }).catch(error => {
        console.error("Error calling OpenAI:", error);
        res.status(500).send("Failed to generate quotes");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
