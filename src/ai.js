// src/ai.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAI() {
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: "Napisz jedno mroczne zdanie w klimacie dark fantasy.",
  });

  return response.output_text;
}

module.exports = { testAI };