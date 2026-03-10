"use client"
import React, { useState,useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../providers/Socket";

const HomePage=()=>
{
    const router=useRouter()
    const {socket}=useSocket();
    
    const [email,setEmail]=useState();
    const [roomId,setRoomId]=useState();
    
    const handleJoinRoom=()=>{
        socket.emit('join-room',{emailId:email,roomId:roomId})
    }
    const handleRoomJoined=useCallback(({roomId})=>{
       router.push(`/room/${roomId}`,)
    },[router])
    useEffect(()=>{
        socket.on('joined-room',handleRoomJoined)
        return()=>{
            socket.off('joined-room',handleRoomJoined)
        }
    },[handleRoomJoined,socket])
    return (
    <div className="min-h-screen bg-gray-100 border   shadow-md flex items-center justify-center p-4">
  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6">
    
    
    <div className="flex flex-col gap-3">
      <label className="text-gray-700 text-primary font-semibold text-lg">Email Address</label>
      <input value={email} onChange={(e)=>setEmail(e.target.value)}
        type="email" 
        placeholder="Enter your email" 
        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>

    
    <div className="flex flex-col gap-3">
      <label className="text-gray-700 text-primary font-semibold text-lg">Room Code</label>
      <input 
      value={roomId}
      onChange={(e)=>setRoomId(e.target.value)}
        type="text" 
        placeholder="Enter the room code" 
        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>

    
    <button onClick={handleJoinRoom} className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]">
      Join Room
    </button>
    
  </div>
</div>
    )
}
export default HomePage