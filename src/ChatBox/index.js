import React, { useEffect, useState } from 'react';//, useState
import {
  useRemoteVideoTileState,
  RemoteVideo,
  LocalVideo,
  useAudioVideo,
  Input,
  useMeetingManager,

} from 'amazon-chime-sdk-component-library-react';
import './chatbox.css'
import { pick_random_topic, pick_random } from '../Bot/utils';
// import Channel from '../Chat/Channels';
// import MeetingChat from '../Chat/containers/MeetingChat';
// // import { color } from 'styled-system';

export default function ChatBox(props){
  const {meeting, display} = props
  const [text, setText] = useState('')
  const audioVideo = useAudioVideo()
  const {showChatBox, setShowChatBox} = display
  const meetingManager = useMeetingManager()
  const [messages, pushMessage] = useMessage()  
  const forceUpdate = useForceUpdate();

  var lastMessage = 0;

  const users = {}
  meeting.subscribed_users.forEach((user)=>{
    users[user.userId] = user.firstName
  })
  console.log(users)
  
  useEffect(() => {
    if (!audioVideo) return;
    audioVideo.realtimeSubscribeToReceiveDataMessage('message', (dataMessage)=>{
        console.log(dataMessage); 
        if (lastMessage!=dataMessage.timestampMs){
          let strData = new TextDecoder().decode(dataMessage.data);
          let eventMessage = JSON.parse(strData)
          let author = users[dataMessage.senderExternalUserId]
          pushMessage({text: eventMessage.text, author:author})
          forceUpdate()
          console.log(eventMessage);
          lastMessage=dataMessage.timestampMs
        }
        
    })
    
    
        // return ()=>{
        //   try{
        //     audioVideo.realtimeUnsubscribeToReceiveDataMessage('message')
        //   }catch{
        //     console.log('Unsub error')
        //   }
    // }
      
      
  },[audioVideo])

  useEffect(() => {
  if (!audioVideo) return;
  audioVideo.realtimeSubscribeToReceiveDataMessage('botcommand', (dataMessage)=>{
      console.log(dataMessage); 
      if (lastMessage!=dataMessage.timestampMs){
        let strData = new TextDecoder().decode(dataMessage.data);
        let eventMessage = JSON.parse(strData)
        let author = users[dataMessage.senderExternalUserId]
        pushMessage({text: eventMessage.text, author:'bot'})
        forceUpdate()
        console.log(eventMessage);
        lastMessage=dataMessage.timestampMs
      }
      
  })
  
    
},[audioVideo])


  const sendText = ()=>{
    console.log(audioVideo)
    if (!audioVideo) return;
    audioVideo.realtimeSendDataMessage('message',{'text': text});
  }
  const showMessages = ()=>{
      let p = []
      let er = messages.forEach((value,index)=>{
        console.log(value)
        if (value.author == 'me'){
            p.push( 
               <div className={'self-message'} key={index}>
                 <span className={'message-author'}>{value.author}</span>
                 <p className={'message-text'}>{value.text}</p>
               </div>
            )
        }else{
            p.push( 
            <div className={'standard-message'}  key={index}>
              <span className={'message-author'}>{value.author}</span>
              <p className={'message-text'}>{value.text}</p>
            </div>)
        }
        
        
    })
      console.log(er)
      return p
  }
  const sendButton = (e)=>{
    e.preventDefault()
    pushMessage({text:text, author:'me'})
    console.log(messages)
    sendText()
    setText('')
    }

  return (
    <div id="chatbox" style={{display:showChatBox}}>
      <div id='messages-header'>
        <button onClick={(e)=>{setShowChatBox('none')}}>X</button>
      </div>
      <div id='messages-container'>
         {console.log('meeting: ',meeting)}
         {showMessages()}
      </div>
      <form id='send-container'>
        <input id='send-input' onChange={(e)=>{setText(e.target.value)}} onSubmit={sendButton} value={text}></input>
        <button onClick={sendButton}>Enviar</button>
      </form>
      <div className='actions'>
        <button onClick={async (e)=>{
          e.preventDefault()
          const topic =await pick_random_topic()
          console.log(topic)
          let topic_text = topic.topic_name + " - " + topic.topic_description
          pushMessage({text:topic_text, author:'bot'})
          if (!audioVideo) return;
          audioVideo.realtimeSendDataMessage('botcommand',{'text': topic_text});
          forceUpdate()
        }}>Random Topic</button>
        <button onClick={async (e)=>{
          e.preventDefault()
          const activeUsers = meetingManager.activeSpeakers
          console.log(users)
          const user =await pick_random(meeting.subscribed_users)
          console.log(user)
          let user_text
          
          user_text = user.firstName + " has been choosen!"
          
          pushMessage({text:user_text, author:'bot'})
          
          if (!audioVideo) return;
          audioVideo.realtimeSendDataMessage('botcommand',{'text': user_text});
          
          forceUpdate()
        }}>Random Users</button>

      </div>
        
      
    </div>
  )
}

//create your forceUpdate hook
function useMessage(){  
  const [messages, setMessages] = useState([])
  const updateMessages = (msg) =>{
    console.log('olá', msg)
    console.log(msg); 
    let aux = messages
    aux.push({text: msg.text, author:msg.author})
    setMessages(aux)
  }

  return [messages, updateMessages]
}

//create your forceUpdate hook
function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}