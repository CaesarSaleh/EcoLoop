"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import DatabaseNavBar from "@/app/components/DatabaseNavBar";

const filters = [
  {
    id: "filters",
    name: "Filters",
    options: [
      { value: "1", label: "Moonshot", checked: false },
      { value: "2", label: "On-topic", checked: false },
    ],
  }
];

export default function Database() {
  const [currentClaims, setCurrentClaims] = useState([{docid: "12u2u8123828", summary: "This is a summary", viabilityscore: "90%"}]);
  const router = useRouter();

  useEffect(() => {
    document.title = "EcoLoop Dashboard";
  }, []);

  const routeToClaim = async (id) => {
    try {
      router.push("/pair/" + id);
    } catch (err) {}
  };

  const [checkboxState, setCheckboxState] = useState({
    "1": false,
    "2": false,
  });

  // Handle checkbox change
  const handleCheckboxChange = (optionValue) => {
    const newState = checkboxState;
    newState[optionValue] = !checkboxState[optionValue];
    setCheckboxState(newState);
    setCurrentClaims([]);
    getFilteredData();
  };

  const getFilteredData = () => {
    if (!checkboxState["1"] && !checkboxState["2"]) {
      fetch(process.env.BACKEND_URL + "/get_dataset").then((response) => response.json()).then((data) => {setCurrentClaims(data)}).catch((error) => {console.error(error);});
    } else if (checkboxState["1"] && !checkboxState["2"]) {
      fetch(process.env.BACKEND_URL + "/get_moonshots").then((response) => response.json()).then((data) => {setCurrentClaims(data)}).catch((error) => {console.error(error);});
      fetch(process.env.BACKEND_URL + "/get_ontopics").then((response) => response.json()).then((data) => {currentClaims.concat(data)}).catch((error) => {console.error(error);});
    } else if (checkboxState["1"]) {
      fetch(process.env.BACKEND_URL + "/get_moonshots").then((response) => response.json()).then((data) => {setCurrentClaims(data)}).catch((error) => {console.error(error);});
    } else if (checkboxState["2"]) {
      fetch(process.env.BACKEND_URL + "/get_ontopics").then((response) => response.json()).then((data) => {setCurrentClaims(data)}).catch((error) => {console.error(error);});
    }
  };

  useEffect(() => {

    getFilteredData();
  }, [checkboxState]);


const top_space = {
  padding: 10,
  width: 85,
  height: 70,
};

  return (
    <>
      <main className="flex h-screen w-full flex-col items-center justify-between">
        <DatabaseNavBar></DatabaseNavBar>
        <div className="flex justify-center w-full border-gray-200 border-t  bg-gray-50 ">
          <div className="w-[90%] h-full pt-8 text-2xl font-semibold">
            <div className="min-w-full p-4 drop-shadow-md rounded-md border bg-white flex flex-col gap-2">
              <div className="">Problem/Solution Pairs</div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 font-normal">
                  These are problem/solution pairs that have been proposed in the past under the topic of circular economy.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[75%] bg-gray-50 flex justify-center">
          <div className="w-[90%] h-full flex gap-4 justify-between bg-gray-50 py-4">
            <div className="w-[30%] h-full flow-root shadow-xl border bg-white rounded-md overflow-scroll no-scrollbar">
              <form className="hidden lg:block p-4">
                {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  // checked={checkboxState[option.value]}
                                  onChange={() => handleCheckboxChange(option.value)}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-757575"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </div>
            <div className="w-full h-[screen] flow-root shadow-xl border bg-white rounded-md overflow-scroll no-scrollbar">
              <div className="">
                <div className="inline-block min-w-full py-2 align-middle lg:px-4">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Document ID
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Problem Summary
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5  text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter "
                      >
                        Viability Score
                      </th>
                    </tr>
                  </thead>
                  {currentClaims ? (
                    <tbody className="divide-y divide-gray-200 bg-white overflow-scroll">
                      {currentClaims.map((currentClaim) => (
                        <tr
                          key={currentClaim.docid}
                          className="bg-white hover:bg-gray-50 active:bg-gray-100"
                        >
                          <td
                            onClick={async () => {
                              routeToClaim(currentClaim.docid);
                            }}
                            className="cursor-pointer border-b border-slate-100 p-4 pl-8 text-gray-600"
                          >
                            {currentClaim.docid}
                          </td>
                          <td
                            onClick={async () => {
                              routeToClaim(currentClaim.docid);
                            }}
                            className="cursor-pointer border-b border-slate-100 p-4 text-gray-600"
                          >
                            ${currentClaim.summary}
                          </td>
                          <td
                            onClick={async () => {
                              routeToClaim(currentClaim.docid);
                            }}
                            className="cursor-pointer border-b border-slate-100 p-4 pr-8 text-gray-600"
                          >
                            {currentClaim.viabilityscore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div className="bg-gray-700 w-48 animate-pulse h-[5vh] rounded-2xl"></div>
                  )}
                </table>
                </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}