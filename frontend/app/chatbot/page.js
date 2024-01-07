"use client";
// require("dotenv").config();


import ChatbotNavBar from "@/app/components/ChatbotNavBar";
import useSpeechRecognition from "./speech";
import chatCompletion from "./assistant.js"
import createImage from "./dalle";

import Link from 'next/link';



import React, { useEffect, useState } from 'react';

const apiKey = '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';
const prompts = ['REPLY ONLY "Hi, I am EcoLoop, your virtual assistant for rating Eco-friendly Circular Economical ideas! How are you doing?"',
'REPLY ONLY "Certainly! Please input strictly in the format {PROBLEM, SOLUTION} for me to rate your idea"',
"NO EXPLANATION! ONLY OUTPUT NUMBERS! NO LABELLING NUMBERS! Analyze the {PROBLEM, SOLUTION} pair. Return a dictionary with keys as maturity stage market potential, and feasibility; mapped to the numerical values given underneath them. Maturity Stage Given the scope of the project, return the estimated number of years it takes to fully develop it and maximize your market share. Market Potential Return a list containing the estimated market size for this project in terms of millions of people and the estimated unit price for this project in terms of thousands of USD. Feasibility Return a list of floats as the answers to the following questions regarding the project. 0 is definitely not, 1 is definitely yes. The values are located between 0 and 1. Questions: Are we familiar with the technology, Is the project small, Does the project promise a high return on investment, Does the project promise a low break-even point, Is the project risk-tolerant, Are the project's goals aligned with business objectives?"
];
let prompt_index = 0;
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
  const [imageURL, setImageURL] = useState('');

  const [scalability, setScalability] = useState([]);
  const [feasibility, setFeasibility] = useState([]);
  const [innovation, setInnovation] = useState([]);

  // Use the module function
  const handleAskGPT = async(message) => {
    await chatCompletion(apiKey, 
      prompts[prompt_index]
    , message)
    .then(response => {
      console.log(response)
      setResponseMessage(response);
      prompt_index++;
    }, [])
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });    
  }
  let count = 0;
  useEffect(() => {
    if (count < 1) {
      const fetchData = async () => {
        await handleAskGPT("");
      };
      fetchData();
    }
    count++;
  }, []); // Empty dependency array means this will only run once when the component mounts.
  
  useEffect(() => {
    // Now you can do something with the updated responseMessage
    if (count  && responseMessage){
      addMessage(false, responseMessage);
    }
  }, [responseMessage]); // This useEffect will run whenever responseMessage changes

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = async () => {
    setImageURL(null)
    
    if (inputValue.trim() !== '') {
      addMessage(true, inputValue);
      await handleAskGPT(inputValue);
      if (responseMessage !=='1') {
        addMessage(false, responseMessage);
      }
      const imgURL = await createImage(inputValue)
      setImageURL(imgURL)
    } else{
      if (text.trim() !== '') {
        addMessage(true, text);
        await handleAskGPT(text);
        if (responseMessage !=='1') {
          addMessage(false, responseMessage);
          const imgURL = await createImage(text)
          setImageURL(imgURL)
        }
            
      }
    }
    resetText();
  }


  // const redirectToURL = () => {
  //   router.push('https://wallet.hashpack.app/');
  // };
  

  const addMessage = (user, text) => {
    setMessages((prevChatMessages) => [
      ...prevChatMessages,
      { user: user, text: text },
    ]);
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

                {imageURL && prompt_index === 2 && (
                  <>
                    <div className="text-right">
                      <img src={imageURL} alt="Image" className="w-[300px] h-auto" />
                    </div>
                    <div>
                      {/* Bar Chart */}
                      <img src={`https://quickchart.io/chart?c={type:'bar',data:{labels:['familiarity','small','compatibility','high return','high cash flow per debt', 'low break-even point', 'high benefits per cost', 'risk-tolarant', 'goals aligned', 'market ready'],datasets:[{label:'Example',data:${JSON.stringify(feasibility)}}]}}`} alt="Bar Chart" />

                      {/* Line Chart */}
                      <img src={`https://quickchart.io/chart?c={type:'line',data:{labels:['good revenue grow rate','minimized customer acquisition cost','maximized customer retention rate', 'good gross margin', 'good return'],datasets:[{label:'Example',data:${JSON.stringify(scalability)}}]}}`} alt="Line Chart" />

                      {/* Second Bar Chart */}
                      <img src={`https://quickchart.io/chart?c={type:'bar',data:{labels:['multiple patents','multiple services','new technology'],datasets:[{label:'Example',data:${JSON.stringify(innovation)}}]}}`} alt="Second Bar Chart" />
                    </div>
                    <Link className="text-blue-500 underline" href="https://www.google.ca">
                      VR
                    </Link>
                  </>
                )}
              </div>
              <div className="flex p-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={inputValue || text}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
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
                <button id="submitButton" onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md">
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