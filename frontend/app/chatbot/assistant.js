const chatCompletion = async (apiKey, prompt, userMessage) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    max_tokens: 150,
    model: "gpt-3.5-turbo",
    messages: [{ role: 'system', content: prompt }, { role: 'user', content: userMessage }]
    // Add other parameters as needed
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export default chatCompletion;


