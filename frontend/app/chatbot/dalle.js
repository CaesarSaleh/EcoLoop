async function createImage(userMessage) {
  const apiKey = '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';  // Replace with your actual OpenAI API key

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: userMessage,
        n: 1,
        size: '1024x1024',
      }),
    });

    const data = await response.json();
    return data.data[0].url
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export default createImage;