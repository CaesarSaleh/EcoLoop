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
  const [dataLoading, setDataLoading] = useState(true);
  const [claimIndex, setClaimIndex] = useState(0);

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
    setClaimIndex(0);
    setCurrentClaims([]);
    const queryParams = new URLSearchParams(checkboxState);
    getFilteredData(`${queryParams}`);
  };

  const getFilteredData = (params) => {
    setDataLoading(true);
    fetch(`/api/get_filtered/${params}/${claimIndex}`)
      .then((response) => response.json())
      .then((data) => {
        if (claimIndex === 0) {
          setCurrentClaims(data);
        }
        else {
          setCurrentClaims([...currentClaims, ...data]);
        }
        setDataLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(checkboxState);

    // Append the query parameters to the API endpoint
    getFilteredData(`${queryParams}`);
  }, [checkboxState, claimIndex]);

  const handleLoadMore = () => {
    setClaimIndex(claimIndex + 1);
  }


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
              <div className="">Processed Claims</div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 font-normal">
                  These claims have already been processed
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
                        Content
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
                {!dataLoading ? (
                  <div className="flex justify-center w-full mb-4">
                    <button
                      className="px-4 py-2 bg-gray-50 border rounded-md"
                      onClick={handleLoadMore}
                    >
                      Load More
                    </button>
                  </div>
                ) : (
                  <div role="status" className="flex w-full items-center justify-center">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-400 animate-spin  fill-green-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}