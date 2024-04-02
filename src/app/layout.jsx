"use client"
import '../app/globals.scss'
import { Inter, Montserrat } from "next/font/google";
import { NextUIProviders } from "./providers/providers";
import { Provider } from 'react-redux';
import store from './redux/store';
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google"
import * as types from './redux/types'


const inter = Montserrat({ subsets: ['latin'] })

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />

        <link href="/favicon.ico" rel="icon" />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={types.GOOGLE_CLIENT_ID}>
          <Provider store={store}>
            <NextUIProviders>
              {children}
            </NextUIProviders>
          </Provider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
