import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ReactNode} from "react";
import {NextFont} from "next/dist/compiled/@next/font";
import Navbar from "@/app/nav/Navbar";

const inter: NextFont = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Carsties',
    description: 'Generated by create next app',
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Navbar/>
        <main className='container mx-auto px-5 pt-10'>
            {children}
        </main>
        </body>
        </html>
    )
}