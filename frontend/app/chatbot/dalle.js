require('dotenv').config()

async function createImage(userMessage) {
  const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;  // Replace with your actual OpenAI API key
  console.log(apiKey)
 
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: userMessage,
        n: 1,
        size: "1024x1024",
      }),
    });
    const data = await response.json();
    console.log(data)
    return data.data[0].url
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export default createImage;