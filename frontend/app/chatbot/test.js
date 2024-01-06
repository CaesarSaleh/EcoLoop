// test.js
import chatCompletion from './assistant.js'; // Adjust the path accordingly

// Replace 'your-api-key' with your actual API key
const apiKey = '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';
const prompt = 'Reply "1" if the user input contains any curly brace. \
                Reply "Hi, I am EcoLoop, your virtual assistant for rating Eco-friendly Circular Economical ideas! How are you doing?" if prompted with empty string. \
                Reply "Certainly! Please input strictly in the format {PROBLEM, SOLUTION} for me to rate your idea" if prompted with "I want you to rate my idea."';
const userMessage = '';

async function testChatCompletion() {
  try {
    const response = await chatCompletion(apiKey, prompt, userMessage);
    console.log('Response:', response);
    // Add further assertions or use the response as needed in your testing
  } catch (error) {
    console.error('Error:', error);
    // Handle errors if needed
  }
}

// Run the test function
testChatCompletion();
