"use client"
import React, { useEffect,useCallback, useState, useRef } from "react";
import { useSocket } from "../../../app/providers/Socket";
import { usePeer } from "../../../app/providers/Peer";
import VideoPlayer from "../../../app/VideoPlayer";

function RoomPage(){
    const [mystream,setMyStream]=useState(null)
    const [remoteEmailId,setRemoteEmailId]=useState()
    const hasFetchedStream = useRef(false);
     
const {socket}=useSocket()
const {peer,createOffer,createAnswers,setRemoteAns,sendStream,remoteStream}=usePeer()

   const handleNewUserJoined=useCallback(async(data)=>{
    const {emailId}=data
    console.log('New Userjoined room',emailId)
    const offer=await createOffer();
    socket.emit('call-user',{emailId,offer})
    setRemoteEmailId(emailId)
   },[createOffer,socket])
   
   const handleIncommingCall=useCallback(async(data)=>{
    const {from,offer}=data
    console.log("Incomming Call from" ,from, offer)
    const ans=await createAnswers(offer)
    socket.emit('call-accepted',{emailId:from,ans})
    setRemoteEmailId(from)
   },[createAnswers,socket])

   const handleCallAccepted=useCallback(async(data)=>{
    const {ans}=data
    console.log("Call Accepted")
    await setRemoteAns(ans)
    
   },[setRemoteAns])

   const getUserMediaStream=useCallback(async()=>{
    if (hasFetchedStream.current) return;
    hasFetchedStream.current = true;
    const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
   
    setMyStream(stream)
   },[])
   const handleNegotiation=useCallback(async()=>{
      if(!remoteEmailId) return;
      const localOffer = await peer.createOffer();
   
    await peer.setLocalDescription(localOffer);
     socket.emit('call-user',{emailId:remoteEmailId,offer:localOffer})
   },[peer,remoteEmailId,socket])

   useEffect(()=>{
       peer.addEventListener('negotiationneeded',handleNegotiation)
        return()=>{
     
       peer.removeEventListener('negotiationneeded',handleNegotiation)
        }
   },[peer,handleNegotiation])

   useEffect(()=>
{
    socket.on("user-joined",handleNewUserJoined)
    socket.on("Incomming-call",handleIncommingCall)
    socket.on('call-accepted',handleCallAccepted)
    
    

},[socket,handleNewUserJoined,handleIncommingCall,handleCallAccepted])

useEffect(()=>{
    getUserMediaStream()
},[getUserMediaStream])

useEffect(() => {
    if (remoteStream) {
        console.log("Remote Stream Tracks:", remoteStream.getTracks());
        remoteStream.getTracks().forEach(track => {
            console.log(`Track: ${track.kind}, Enabled: ${track.enabled}, ReadyState: ${track.readyState}`);
        });
    }
}, [remoteStream]);
    return(
        <div className="flex flex-col items-center p-5">
        <h1>Room Page</h1>
        <h2>{remoteEmailId}</h2>
        <div className="flex gap-5 mt-5">
           
            <div className="border-2 border-blue-500 rounded">
                <p>My Video</p>
                {mystream && <VideoPlayer 
            stream={mystream} 
            muted={true} 
            title="Local (You)" 
        />}
            </div>

          
            {remoteStream && (
                <div className="border-2 border-green-500 rounded">
                    <p>Remote Video</p>
                    <VideoPlayer 
            stream={remoteStream} 
            muted={true} 
            title="Remote Player" 
        />
                </div>
            )}
        </div>
        <button 
            onClick={() => sendStream(mystream)} 
            className="mt-5 bg-blue-500 text-white p-2 rounded"
        >
            Share My Stream
        </button>
    </div>
    )
 }
 export default RoomPage;