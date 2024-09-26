import React, { ReactNode } from 'react';
import { UserProvider } from './providers/Auth';
import './globals.css';


export const metadata = {
 title: "WCOA Rides",
 description: 'A Unique Employee Management System'
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
   <html lang="en">
         <body>
         <UserProvider>
                 <div className="main">
                     <div className="gradient" />
                 </div>
                 <main className="app">
                     {children}
                 </main>
             </UserProvider>
         </body>
     </html>
 );
}
