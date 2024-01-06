'use client'
import { useRouter } from 'next/navigation'
import React, {useEffect, useState} from 'react'


const Login = () => {

    useEffect(() => {
        document.title = 'EcoLoop Login';
    }, []);

  const router = useRouter()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleLogin = (e) => {
    e.preventDefault()

    if ((data.email === 'kuzey@gmail.com' || data.email=== 'caesar@gmail.com') && data.password === '12345') {
      router.push('/landing')
    }
  }

  const gotoMinting = () =>{
    router.push('/minting')
  }

  return (
    <div className='h-screen  justify-center'>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-16 w-auto rounded-lg" src="/logo.png" alt="Your Company"/>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-757575 text-[#132143]">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                <div>
                    <label className="block text-sm font-medium leading-6 text-757575 text-[#132143]">Email address</label>
                    <div className="mt-2">
                    <input id="email" onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            } value={data.email} name="email" type="email" required className="focus:outline-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#132143] sm:text-sm sm:leading-6 pl-2"/>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-757575 text-[#132143]">Password</label>
                    <div className="text-sm">
                        <a href="#" className="font-semibold text-[#132143] hover:text-[#132143]">Forgot password?</a>
                    </div>
                    </div>
                    <div className="mt-2">
                    <input id="password" onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            } value={data.password} name="password" type="password" required className="focus:outline-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#132143] sm:text-sm sm:leading-6 pl-2" />
                    </div>
                </div>

                <div>
                    <button type="submit" onClick={handleLogin} className="flex w-full justify-center rounded-md bg-[#132143] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#132143] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#132143]">Sign in</button>
                </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default Login