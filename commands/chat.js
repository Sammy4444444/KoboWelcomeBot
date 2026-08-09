const ai = require("../config/gemini");
const PERSONA = require("../config/persona");

async function chatWithKacung(userMessage) {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${PERSONA}

Pesan dari user:
${userMessage}`
                    }
                ]
            }
        ]
    });

    return response.text;
}

module.exports = { chatWithKacung };