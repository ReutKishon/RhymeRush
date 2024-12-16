const axios = require('axios');

const apiKey = '';

async function checkApiKeyValidity() {
  const url = "https://api.openai.com/v1/models";

  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    console.log("✅ API key is valid.");
    console.log("Available models:", response.data.data.map(model => model.id));
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("❌ API key is invalid or missing permissions.");
    } else if (error.response?.status === 429) {
      console.error("⚠️ Rate limit hit. Try again later.");
    } else {
      console.error("⚠️ An error occurred:", error.response?.status, error.message);
    }
  }
}

checkApiKeyValidity();
