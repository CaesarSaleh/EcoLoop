"use client";
// require("dotenv").config();


import ChatbotNavBar from "@/app/components/ChatbotNavBar";
import useSpeechRecognition from "./speech";
import {chatCompletion} from "./assistant.js"


import React, { useEffect, useState } from 'react';

const apiKey = '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';
const prompt = 'Reply "1" if the user input contains any curly brace. \
Reply "Hi, I am EcoLoop, your virtual assistant for rating Eco-friendly Circular Economical ideas! How are you doing?" if prompted with empty string. \
Reply "Certainly! Please input strictly in the format {PROBLEM, SOLUTION} for me to rate your idea" if prompted with "I want you to rate my idea."';

const Chatbot = () => {
  
  const {
    text,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasRecognitionSupport,
  } = useSpeechRecognition();
  
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');


  // Use the module function
  const handleAskGPT = (message) => {
    setTimeout(() => {
      chatCompletion(apiKey, 
        prompt
      , message)
      .then(response => {
        console.log(response);
        
        setResponseMessage(response.toString());
      }, [])
      .catch(error => {
        // Handle errors
        console.error('Error:', error);
      });
    }, 10000);
    
    
  }
  
  useEffect(() => {
    const response = handleAskGPT("")
    addMessage(false, response)
  }, [])
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      addMessage(true, inputValue);
      handleAskGPT(inputValue);
      
      addMessage(false, responseMessage);
    }

    resetText();
  };

  const addMessage = (user, text) => {
    setMessages((prevChatMessages) => [
      ...prevChatMessages,
      { user: user, text: text},
    ]) 
    setInputValue('');
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Trigger the click event on the submit button
      document.getElementById('submitButton').click();
    }
  };

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-between">
        <ChatbotNavBar></ChatbotNavBar>
        <div className="flex h-full justify-center w-full border-gray-200 border-t  bg-gray-50 py-2">
          <div className="w-[90%] h-full pt-8 text-2xl font-normal">
            <div className="min-w-full p-4 drop-shadow-md rounded-md border bg-white flex flex-col gap-2">
              <div className="">Virtual Assistant</div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 font-normal">
                  This virtual assistant will help you validate and add your idea into the database.
                </div>
              </div>
            </div>
            {/* Messaging Interface */}
            <div className="flex flex-col h-3/4 mt-8 overflow-hidden">
              <div className="flex flex-col flex-grow overflow-auto">
                {messages.map((message, index) => (
                  <div key={index} className={message.user ? 'text-right' : 'text-left'}>
                    <div className={message.user ? "p-2 bg-blue-700 rounded-md inline-block text-white" : "p-2 bg-gray-200 rounded-md inline-block max-w-[600px]"}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex p-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={inputValue || text}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="w-full p-2 border rounded-md mr-2"
                  />
                  {/* Add the image button inside the input bar */}
                  <button
                    className="absolute right-0 top-0 m-2 p-2 bg-gray-300 rounded-md"
                    style={{ paddingBottom: '4px' }}
                    onClick={startListening}
                  >
                    <img
                      src="/mic.png"
                      alt="Image"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
                <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Chatbot;