import Link from "next/link";
import { Menu } from "@headlessui/react"
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

const top_space = {
    padding: 10,
    width: 80,
    height: 70,
  };

  const top_space2 = {
    padding: 10,
    width: 80,
    height: 70,
  };

  const user = {
    name: "Caesar Saleh",
    email: "caesarssaleh@gmail.com",
    imageUrl:
        "/profile.png",
  };
  


const DatabaseNavBar = () => {
    return(
      
        <div className="flex w-full p-4 items-center border-b border-white gradient-crown bg-white">
                <Link href="/">
              <img className={`width: 400px`} src="/logo.png" alt="Your Company" style={top_space2}/>
            </Link>
                <div className={`bg-white justify flex p-2 gap-8 w-full`}>
                    <Link className="py-2 border rounded w-full px-4 text-center bg-white" href={"/chatbot"}>
                      Chatbot
                    </Link>
                    <div className="py-2 border rounded w-full px-4 bg-[#0b9541] text-white text-center font-bold">
                      Database
                    </div>
                </div>

          
          <div className="flex">
              <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full rounded-md bg-white px-1 py-1 text-sm font-semibold">
          {/* <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
          <img className="rounded-full" src={user.imageUrl} alt="Caesar" style={top_space} />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">

        <Menu.Items className="absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-center">
          <div className="py-1">
            <form method="POST" action="#">
              <Menu.Item>
                {({ active }) => (
                  <button type="submit" onClick={() => handleLogout }>
                    <Link href="/">Log Out</Link>
                  </button>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
          </div>
          
        </div>
        
    )
}

export default DatabaseNavBar;