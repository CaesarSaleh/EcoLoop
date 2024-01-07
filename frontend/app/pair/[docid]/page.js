"use client";
import { Bar } from 'react-chartjs-2';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Menu, Popover } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
require('dotenv').config()


export default function CurrentPairView({params}) {
    const [claim_data, setClaimData] = useState(null);
    const [keywords, setKeywords] = useState(null);
    const router = useRouter();
    const chatGptApiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const radarChartData = {
        labels: ['Maturity', 'Potential', 'Feasibility', 'Scalability', 'Score', 'Ontopic', 'Moonshot'],
        datasets: [
            {
                label: 'Metrics',
                data: [
                    claim_data?.maturity * 100 || 0,
                    claim_data?.potential * 100 || 0,
                    claim_data?.feasibility * 100 || 0,
                    claim_data?.scalability * 100 || 0,
                    claim_data?.score * 100 || 0,
                    claim_data?.ontopic * 100 || 0,
                    claim_data?.moonshot * 100 || 0,
                ],
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };
    

    const barChartData = {
        labels: ['Maturity', 'Potential', 'Feasibility', 'Scalability', 'Score'],
        datasets: [
            {
                label: 'Metrics',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: [
                    claim_data?.maturity*100 || 0,
                    claim_data?.potential*100 || 0,
                    claim_data?.feasibility*100 || 0,
                    claim_data?.scalability*100 || 0,
                    claim_data?.score*100 || 0,
                ],
            },
        ],
    };

    useEffect(() => {
        // Hardcoded claim_data
        const hardcodedClaimData = {
            problem: "Fashion industry makes the most waste.",
            solution: "Open a factory that has machines that can turn clothing back into fabric. Then other machines in the factory make new clothes from this fabric.",
            maturity: 0.1,
            potential: 0.2,
            feasibility: 0.3,
            scalability: 0.4,
            score: 0.5,
            validation: "I need coffee",
            moonshot: 0,
            ontopic: 1,
            summary: "Tim's",
            id: 69,
            created_at: new Date().toISOString()
        };

        // Set the hardcoded data to the state
        setClaimData(hardcodedClaimData);

        // Log the response
        console.log("Hardcoded claim_data:", hardcodedClaimData);
    }, []);


// if (!params.claim_id) {
//     return <div>No claim id</div>
// }

// const claim_id = params.docid;

useEffect(() => {
        const getLifeClaim = async (docid) => {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', // Set the content type to JSON
                  // Add any additional headers if needed
                },
                body: JSON.stringify({id: docid}) // Convert the data to JSON format
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json(); // Assuming the server returns JSON data
                })
                .then(data => {
                  setClaimData(data);
                  console.log("Response from server:", data);
                })
                .catch(error => {
                  // Handle errors
                  console.error("Error:", error);
                });              
        };

        getLifeClaim(params.docid);
}, []);
// } <-- Remove this closing curly brace
var x = 0
useEffect(() => {
    const extractKeywords = async () => {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chatGptApiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    "messages" : [{"role" : "user", "content" : `Extract five keywords separated by commas:${claim_data.solution}`}],
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            console.log(data)
            setKeywords(data.choices[0].message.content);
            console.log(keywords)
        } catch (error) {
            console.error('Error extracting keywords:', error.message);
        }
    };
        console.log(extractKeywords());
        console.log(keywords)
    x++
}, [claim_data]);

    return (
        <>
            <div className="min-h-full bg-gray-50">
                <Popover as="header" className="bg-[#0b9541] pb-24">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                <div className="relative flex items-center justify-center py-5 lg:justify-between">
                                    {/* Logo */}
                                    <div className="absolute left-0 flex-shrink-0 lg:static flex">
                                        <button
                                            className="flex gap-2"
                                            onClick={() => {
                                                router.back();
                                            }}
                                        >
                                            <div className="text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24" className="inline pb-1">
                                            <path d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M20 11H7.414l2.293-2.293a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L7.414 13H20a1 1 0 0 0 0-2z"/>
                                            </svg>

                                            Back</div>
                                        </button>
                                    </div>

                                    {/* Right section on desktop */}
                                    <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-4 flex-shrink-0">
                                            <div>
                                                <Menu.Button className="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-14 w-14 rounded-full" alt="" src="/profile.png"/>
                                                </Menu.Button>
                                            </div>
                                        </Menu>
                                    </div>
                                </div>
                                <div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
                                    <div className="grid grid-cols-3 items-center gap-8">
                                        <div className="col-span-2">
                                            <nav className="flex space-x-4"></nav>
                                        </div>
                                        <div>
                                            <div className="mx-auto w-full max-w-md"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Popover>
                <main className="-mt-24 pb-8">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <h1 className="sr-only">Page title</h1>
                        {/* Main 3 column grid */}
                        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                            {/* Left column */}
                            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                                <section aria-labelledby="section-1-title">
                                    <div className="overflow-hidden rounded-lg bg-white shadow">
                                        <div className="p-6">
                                            <div className="relative h-[75vh] w-full text-black overflow-scroll no-scrollbar">
                                                <div className="sticky top-0 border-b-2 border-gray-100 bg-white px-2 py-3 sm:px-6">
                                                    <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                                                        <div className="ml-4 mt-4">
                                                            {claim_data ? (
                                                                <h1 className="text-lg font-medium leading-6 text-gray-900">
                                                                    Metrics 
                                                                </h1>
                                                                
                                                            ) : (
                                                                <div className="bg-gray-200 w-[80%] animate-pulse h-[5vh] rounded-2xl">
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                              {/* General info card */}
{claim_data ? (
    <div className="mt-4 space-y-4">
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Problem</span></p>
            <p className="text-right">{claim_data.problem}</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Solution</span></p>
            <p className="text-right">{claim_data.solution}</p>
        </div>
        <hr className="my-4 border-t border-gray-300" />
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Maturity</span></p>
            <p className="text-right">{claim_data.maturity*100}%</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Potential</span></p>
            <p className="text-right">{claim_data.potential*100}%</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Feasibility</span></p>
            <p className="text-right">{claim_data.feasibility*100}%</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Scalability</span></p>
            <p className="text-right">{claim_data.scalability*100}%</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Score</span></p>
            <p className="text-right">{claim_data.score*100}%</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Validation</span></p>
            <p className="text-right">{claim_data.validation}</p>
        </div>
        <hr className="my-4 border-t border-gray-300" />
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Moonshot</span></p>
            <p className="text-right">{claim_data.moonshot === 1 ? 'Yes' : 'No'}</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Ontopic</span></p>
            <p className="text-right">{claim_data.ontopic === 1 ? 'Yes' : 'No'}</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Summary</span></p>
            <p className="text-right">{claim_data.summary}</p>
        </div>
        <hr className="my-4 border-t border-gray-300" />
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">ID</span></p>
            <p className="text-right">{claim_data.id}</p>
        </div>
        <div className="flex justify-between">
            <p className="text-left"><span className="font-bold">Created At</span></p>
            <p className="text-right">{claim_data.created_at}</p>
        </div>
        <div className="flex justify-between"><p>{keywords}</p></div>
    </div>
) : (
    <div className="bg-gray-200 w-[80%] animate-pulse h-[5vh] rounded-2xl"></div>
)}




                                                
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right column */}
                            <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">
                            <div className="ml-4 mt-4">
                                <h1 className="text-lg font-medium leading-6 text-gray-900">
                                    Visualization
                                </h1>
                            </div>
                            <hr className="my-2 border-t border-gray-300" />
                            <div className="h-[85vh] overflow-scroll no-scrollbar">
                                {/* Bar graph */}
                                <Bar data={barChartData} height={300} />
                                <Radar data={radarChartData} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}