import { Inter } from 'next/font/google'
import './globals.css'
import Head from "next/head";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EcoLoop',
  description: 'More Informed Decisions for a Greener Earth!',
  icons: {
    icon: '/logo.png', 
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}