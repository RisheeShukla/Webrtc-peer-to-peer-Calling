"use client"
import React from "react";
import Link from "next/link";
import { Routes,Route } from "react-router-dom";
import { SocketProvider } from "./providers/Socket";
function App(){
    return (
        <div className="p-8 flex items-start gap-120 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-primary">
        Welcome
      </h1>
      
      <Link 
        href="/Home" 
        className="inline-block px-4 py-2 bg-red-500 text-white font-semibold 
                   rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg 
                   transform transition-all duration-200 active:scale-95"
      >
        Home
      </Link>
      
    </div>
    )
}
export default App;