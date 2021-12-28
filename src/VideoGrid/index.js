import React, { useEffect, useState } from 'react';//, useState
import {
  useRemoteVideoTileState,
  RemoteVideo,
  LocalVideo,
  useAudioVideo,

} from 'amazon-chime-sdk-component-library-react';
import MeetingControl from '../MeetingControl';
import './videogrid.css'
import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, DefaultRealtimeController, LogLevel, MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
import ChatBox from '../ChatBox';
// import Channel from '../Chat/Channels';
// import MeetingChat from '../Chat/containers/MeetingChat';
// // import { color } from 'styled-system';

export default function MyVideoGrid(props){
  const {meeting, attendee} = props 
  // const [tiles, setTiles] = useState([])
  const { tiles } = useRemoteVideoTileState();
  const [messages, setMessages] = useState([])
  const audioVideo = useAudioVideo()
  const [showChatBox, setShowChatBox] =useState('block')
  

  useEffect(() => {
    if (!audioVideo) return;
  
    audioVideo.realtimeSubscribeToReceiveDataMessage('message', (msg)=>{
        console.log(msg); 
        let aux = messages
        aux.push('oi')
        setMessages(aux)});
  
  }, [audioVideo])

  const sendTest = ()=>{
    if (!audioVideo) return;
    audioVideo.realtimeSendDataMessage('message','oi');
  }
  

  const videos = tiles.map((tileId) => {console.log(tileId);return <RemoteVideo tileId={tileId} />})
  console.log("Tiles: ",tiles)
  return (
    <>
    <div className={`grid grid--size-${tiles.length}`} id="video-grid">
      <div className={"videos-container"}>
        <div className={"remote-container"}>
          { tiles.length ? videos: <p>Waiting others speakers</p>}
        </div>
        
        <LocalVideo id="local-video"></LocalVideo>
      </div>     
      
      <MeetingControl onLeave={()=>{props.onLeave()}} display={{showChatBox, setShowChatBox}}></MeetingControl>
    </div>
    <ChatBox meeting={meeting} display={{showChatBox, setShowChatBox}}></ChatBox>
    </>
  )
}
