'use client'
import Login from './login';

export default function Home() {
  return (
      <main>
        {/* <AuthContextProvider> */}
          <div>
          {<Login/>}
          </div>
        {/* </AuthContextProvider> */}
      </main>
  );
}