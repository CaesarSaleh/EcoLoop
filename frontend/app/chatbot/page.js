"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChatbotNavBar from "../components/ChatbotNavBar";

const user = {
  name: "Caesar Saleh",
  email: "caesarssaleh@gmail.com",
  imageUrl:
      "/profile.png",
};

export default function Chatbot() {
  const router = useRouter();
  const [currentClaims, setCurrentClaims] = useState([{docid: "12u2u8123828", summary: "This is a summary", viabilityscore: "90%"}]);
  const [dataLoading, setDataLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    document.title = "EcoLoop Dashboard";
  }, []);

  useEffect(() => {
  }, [])

  function handleLoadMore() {
    setPage(page + 1);
  }

  const routeToClaim = async (id) => {
    try {
      router.push("/pair/" + id);
    } catch (err) {}
  };

  const top_space = {
    padding: 10,
    width: 85,
    height: 70,
  };

  return (
    <>
        <ChatbotNavBar></ChatbotNavBar>
      <main className="flex h-screen w-full flex-col items-center justify-between">
        <div className="flex h-full justify-center w-full border-gray-200 border-t  bg-gray-50 py-2">
          <div className="w-[90%] h-full pt-8 text-2xl font-semibold">
            <div className="min-w-full p-4 drop-shadow-md rounded-md border bg-white flex flex-col gap-2">
              <div className="">Current Claims</div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 font-normal">
                  These claims still need to be processed
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[75%] flex justify-center bg-gray-50 ">
          <div className="w-[90%] h-[75vh] flow-root shadow-xl border bg-white rounded-md overflow-scroll no-scrollbar">
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
                          key={currentClaim.claimNumber}
                          className="bg-white hover:bg-gray-50 active:bg-gray-100"
                        >
                          <td
                            onClick={async () => {
                              routeToClaim(currentClaim.claimNumber);
                            }}
                            className="cursor-pointer border-b border-slate-100 p-4 pl-8 text-gray-600"
                          >
                            {currentClaim.docid}
                          </td>
                          <td
                            onClick={async () => {
                              routeToClaim(currentClaim.claimNumber);
                            }}
                            className="cursor-pointer border-b border-slate-100 p-4 text-gray-600"
                          >
                            ${currentClaim.summary}
                          </td>
                          <td
                            onClick={async () => {
                              routeToClaim(currentClaim.claimNumber);
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
                <button className="px-4 py-2 bg-gray-50 border rounded-md" onClick={handleLoadMore}>
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
      </main>
    </>
  );
}