const express=require('express')
const {Server}=require('socket.io')
const bodyparser=require('body-parser')
const io=new Server({
    cors:true
});
const app=express();

app.use(bodyparser.json())
const emailToSocketMapping=new Map()
const socketToEmailMapping=new Map()
io.on("connection",(socket)=>{
    
    socket.on('join-room',(data)=>{
        const roomId=data.roomId
        const emailId=data.emailId
        console.log('User',emailId,"Joined Room",roomId)
        
        emailToSocketMapping.set(emailId,socket.id)
        socketToEmailMapping.set(socket.id,emailId)
        socket.join(roomId)
        socket.emit('joined-room',{roomId})
        socket.broadcast.to(roomId).emit("user-joined",{emailId})
    })
    socket.on("call-user",(data)=>{
        const {emailId,offer}=data
         const fromEmail=socketToEmailMapping.get(socket.id)
        const socketId=emailToSocketMapping.get(emailId)
        socket.to(socketId).emit('Incomming-call',{from:fromEmail,offer})
    })
    socket.on('call-accepted',(data)=>{
        const {emailId,ans}=data
        const socketId=emailToSocketMapping.get(emailId)
        socket.to(socketId).emit('call-accepted',{ans})
    })
})
app.listen(8000,()=>
    console.log('Http server running at port 8000')
)
 io.listen(8001);
