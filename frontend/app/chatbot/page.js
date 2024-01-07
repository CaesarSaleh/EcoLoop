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
'REPLY 1'
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

  let res = null;
  // Use the module function (Small Talk)
  const handleAskGPT = async(message) => {
    await chatCompletion(apiKey, 
      prompts[prompt_index]
    , message)
    .then(response => {
      console.log(response)
      res = response;
      // setResponseMessage(response);
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
        addMessage(false, res);
      };
      fetchData();
    }
    count++;
  }, []); // Empty dependency array means this will only run once when the component mounts.
  
  
  // useEffect(() => {
  //   // Now you can do something with the updated responseMessage
  //   if (!count && responseMessage && count % 2 == 0){
  //     addMessage(false, responseMessage);
  //   }
  // }, [responseMessage]); // This useEffect will run whenever responseMessage changes

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = async () => {
    setImageURL(null)
    
    if (inputValue.trim() !== '') {
      addMessage(true, inputValue);
      if (prompt_index < 2) {
        await handleAskGPT(inputValue);
        addMessage(false, res);
      } else {
        
        // const response = await handleAskRAG(inputValue);   // problem solution pair
        // console.log(response.metrics)
        // console.log(response.result)
        // createImage(response.result)
        // 1. data visualization

        // 2. stable difussion
        const imgUrl = await createImage(inputValue)
        setImageURL(imgUrl)
        // 3. add validation text
        // addMessage(false, response.result)
        // 4. calculate viability score
        // 5. button for VR
      }

    }
      // if (responseMessage ==='1') {
      //   const imgURL = await createImage(inputValue)
      //   setImageURL(imgURL)
      // } else {
      //   addMessage(false, responseMessage);
      // }
    // } else{
    //   if (text.trim() !== '') {
    //     addMessage(true, text);
    //     await handleAskGPT(text);
    //     if (responseMessage ==='1') {
    //       addMessage(false, responseMessage);
    //       const imgURL = await createImage(text)
    //       setImageURL(imgURL)
    //     }
            
    //   }
    // }
    resetText();


  }

  const handleAskRAG = async(message) => {
    const response = await fetch('http://localhost:4000/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem: message.split(',')[0],
        solution: message.split(',')[1],
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.result;
    } else {
      throw new Error('Failed to fetch data');
    }
  
  }

  const redirectToURL = () => {
    console.log("google.com")
  };
  

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

  const handleAddSingle2DB = () => {

  }

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
                      {/* <img src={`https://quickchart.io/chart?c={type:'bar',data:{labels:['familiarity','small','compatibility','high return','high cash flow per debt', 'low break-even point', 'high benefits per cost', 'risk-tolarant', 'goals aligned', 'market ready'],datasets:[{label:'Example',data:${JSON.stringify(feasibility)}}]}}`} alt="Bar Chart" /> */}

                      {/* Line Chart */}
                      {/* <img src={`https://quickchart.io/chart?c={type:'line',data:{labels:['good revenue grow rate','minimized customer acquisition cost','maximized customer retention rate', 'good gross margin', 'good return'],datasets:[{label:'Example',data:${JSON.stringify(scalability)}}]}}`} alt="Line Chart" /> */}

                      {/* Second Bar Chart */}
                      {/* <img src={`https://quickchart.io/chart?c={type:'bar',data:{labels:['multiple patents','multiple services','new technology'],datasets:[{label:'Example',data:${JSON.stringify(innovation)}}]}}`} alt="Second Bar Chart" /> */}
                    </div>
                    <button onClick={redirectToURL} className="text-xs rounded-full border border-blue-700 text-blue-700 p-1 mr-1">
                      View Virtual Reality
                    </button>
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
                
                <button
                  id="submitButton"
                  onClick={handleSubmit}
                  className="p-2 bg-blue-500 text-white rounded-md"
                >
                  Submit
                </button>
                <button
                  id="additionalButton"
                  onClick={handleAddSingle2DB}
                  className="p-2 bg-green-500 text-white rounded-md"
                >
                  Add to database
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