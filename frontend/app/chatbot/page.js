"use client";
require("dotenv").config();

import ChatbotNavBar from "@/app/components/ChatbotNavBar";
import useSpeechRecognition from "./speech";
import chatCompletion from "./assistant.js"
import createImage from "./dalle";

import {useRouter} from 'next/navigation';
import CsvFileReader from "./addCSV";


import React, { useCallback, useEffect, useState } from 'react';

const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;
const prompts = ['REPLY ONLY "Hi, I am EcoLoop, your virtual assistant for rating Eco-friendly Circular Economical ideas! How are you doing?"',
'REPLY ONLY "Certainly! Please input strictly in the format PROBLEM || SOLUTION for me to rate your idea"',
'REPLY 1'
];
let prompt_index = 0;
const Chatbot = () => {
  const router = useRouter();
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
  const [imageURL, setImageURL] = useState('');
  const[feasibility, setFeasibility] = useState(0);
  const[scalability, setScalability] = useState(0);
  const[maturityStage, setMaturityStage] = useState(0);
  const[marketPotential, setMarketPotential] = useState(0);
  const[viabilityScore, setViabilityScore] = useState(0);
  
  let res = null;
  // Use the module function (Small Talk)
  const handleAskGPT = async(message) => {
    console.log(apiKey)
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
        const metrics = {
          "Maturity Stage": 0.3,
          "Market Potential": 0.8,
          "Feasibility": 0.5,
          "Scalability": 0.6
          };
        const validation_text = "It looks like you've provided a set of values associated with different factors related to a business or product. These values seem to represent assessments or scores for various aspects. Here's a breakdown based on the provided data: Maturity Stage: 0.3 This may indicate the current stage of maturity of a product, project, or business. A value of 0.3 suggests that it might be in the early stages of development or adoption. Market Potential: 0.8 This value of 0.8 indicates a relatively high market potential. It suggests that there is a favorable market for the product or business, and there is a good opportunity for growth. Feasibility: 0.5 A feasibility score of 0.5 suggests a moderate level of feasibility. This could refer to the practicality and viability of the project or product. Scalability: 0.6 A scalability score of 0.6 implies a moderate level of scalability. Scalability refers to the ability of a system, product, or business to handle growth and increased demand. Overall, these values seem to provide a snapshot of the current state and potential of the subject, with moderate to high market potential, feasibility, and scalability, but a lower maturity stage. Keep in mind that the interpretation may vary based on the specific context and industry.";
        
        // const response = await handleAskRAG(inputValue);   // problem solution pair
        // console.log(response)
        // console.log(response.metrics)
        // console.log(response.validationText)
        const imgUrl = await createImage(inputValue)
        // 1. data visualization
        setMaturityStage(metrics["Maturity Stage"]);
        setMarketPotential(metrics["Market Potential"]);
        
        setFeasibility(metrics["Feasibility"]);
        setScalability(metrics["Scalability"]);
        addMessage(false, validation_text);
        
        
        setImageURL(imgUrl)
        setViabilityScore((metrics["Maturity Stage"] + metrics["Market Potential"] + metrics["Feasibility"] + metrics["Scalability"])*25);
        console.log(viabilityScore)
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


  // const handleAskRAG = async (input) => {
  //   console.log(input)
  //   fetch('/api/validate', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',

  //     },
  //     body: JSON.stringify({"query":{
  //       "problem": input.split(",\"")[0],
  //       "solution": input.split(",\"")[0],
  //     }}),
  //   }).then(response => response.json()).then(data =>
  //     {
  //       metrics = {
  //         "Maturity Stage": 0.3,
  //         "Market Potential": 0.8,
  //         "Feasibility": 0.5,
  //         "Scalability": 0.6
  //         };
  //       validation_text = "It looks like you've provided a set of values associated with different factors related to a business or product. These values seem to represent assessments or scores for various aspects. Here's a breakdown based on the provided data: Maturity Stage: 0.3 This may indicate the current stage of maturity of a product, project, or business. A value of 0.3 suggests that it might be in the early stages of development or adoption. Market Potential: 0.8 This value of 0.8 indicates a relatively high market potential. It suggests that there is a favorable market for the product or business, and there is a good opportunity for growth. Feasibility: 0.5 A feasibility score of 0.5 suggests a moderate level of feasibility. This could refer to the practicality and viability of the project or product. Scalability: 0.6 A scalability score of 0.6 implies a moderate level of scalability. Scalability refers to the ability of a system, product, or business to handle growth and increased demand. Overall, these values seem to provide a snapshot of the current state and potential of the subject, with moderate to high market potential, feasibility, and scalability, but a lower maturity stage. Keep in mind that the interpretation may vary based on the specific context and industry.";

  //       return data; 
  //     }
  //     ).catch(err => console.log(err, "errrorororro"));  
  // }

  const redirectToURL = () => {
    router.push("https://www.google.ca")
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

  const handleAddSingle2DB = async () => {
    // http request to store {pair: {problem: prob, solution: sol}, maturity, market_potential, scalability, feasibility, score, validation text}
    const response = await fetch('http://localhost:4000/add_to_db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        pair:{problem, solution}, 
        maturity,
        market_potential,
        scalability,
        feasibility,
        score,
        validation_text
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      
      return data.result;
    } else {
      throw new Error('Failed to fetch data');
    }
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
              <CsvFileReader/>
            </div>
            {/* Messaging Interface */}
            <div className="flex flex-col h-[47vh] mt-8 overflow-hidden">
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

                      <img src={`https://quickchart.io/chart?c={type:'bar',data:{labels:['Maturity Stage','Market Potential','Feasibility','Scalability'],datasets:[{label:'Example',data:${JSON.stringify([maturityStage, marketPotential, feasibility, scalability])}}]}}`} alt="Bar Chart" />

                    </div>
                    <button onClick={redirectToURL} className="max-w-[300px] text-xs rounded-full border border-blue-700 text-blue-700 p-1 mr-1">
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
                  className="p-1 text-sm bg-[#0b9541] text-white rounded-md m-1"
                >
                  Submit
                </button>
                <button
                  id="addSingle"
                  onClick={handleAddSingle2DB}
                  className="p-1 text-sm bg-[#0b9541] text-white rounded-md m-1"
                >
                  Add Pair
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