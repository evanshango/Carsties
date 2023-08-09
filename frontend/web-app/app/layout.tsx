import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ReactNode} from "react";
import {NextFont} from "next/dist/compiled/@next/font";
import Navbar from "@/app/nav/Navbar";
import ToasterProvider from "@/app/providers/ToasterProvider";
import SignalRProvider from "@/app/providers/SignalRProvider";
import {fetchCurrentUser} from "@/app/actions/authActions";

const inter: NextFont = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Carsties'
}

export default async function RootLayout({children}: { children: ReactNode }) {
    const user = await fetchCurrentUser()
    return (
        <html lang="en">
        <body className={inter.className}>
        <ToasterProvider/>
        <Navbar/>
        <main className='container mx-auto px-5 pt-10'>
            <SignalRProvider user={user}>
                {children}
            </SignalRProvider>
        </main>
        </body>
        </html>
    )
}
