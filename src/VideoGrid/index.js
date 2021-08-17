import React, { useEffect } from 'react';//, useState
import {
  useRemoteVideoTileState,
  RemoteVideo,
  LocalVideo,

} from 'amazon-chime-sdk-component-library-react';
import MeetingControl from '../MeetingControl';
import './videogrid.css'
// import { color } from 'styled-system';

export default function MyVideoGrid(props){
  // const [tiles, setTiles] = useState([])
  const { tiles } = useRemoteVideoTileState();
  useEffect(()=>{
    
    console.log(tiles)
  })
  

  const videos = tiles.map((tileId) => {console.log(tileId);return <RemoteVideo tileId={tileId} />})
  console.log("Tiles: ",tiles)
  return (
    <div className={`grid grid--size-${tiles.length}`} id="video-grid">
      <div className={"videos-container"}>
        <div className={"remote-container"}>
          { tiles.length ? videos: "Aguardando inicio de chamada"}
        </div>
        
        <LocalVideo id="local-video"></LocalVideo>
      </div>     
      
      <MeetingControl onLeave={()=>{props.onLeave()}}></MeetingControl>
    </div>
  )
}
