import { ReduxProvider } from '@/redux/provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Depot',
  description: 'A simplified e-commerce app that integrates with DWN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <main className='p-4 max-w-7xl m-auto min-w-[300px]'>
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  )
}
