import React, {useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import { AmplifyAuthenticator, AmplifySignIn, AmplifySignUp, withAuthenticator} from '@aws-amplify/ui-react';
import './App.css';
import Channel from './Chat/Channels'
import MyVideoGrid from './VideoGrid'
import { ThemeProvider } from 'styled-components';
import { darkTheme, MeetingProvider, useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import axios from 'axios'
import { AuthProvider } from './Chat/providers/AuthProvider';
import { MessagingProvider } from './Chat/providers/ChatMessagesProvider';
import { UserPermissionProvider } from './Chat/providers/UserPermissionProvider';
import { AppStateProvider } from './Chat/providers/AppStateProvider';
import { useChatChannelState } from './Chat/providers/ChatMessagesProvider';
// import { describeChannel } from './Chat/api/ChimeAPI';
Amplify.configure(awsconfig);



function App (props){
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState(); 

 
  React.useEffect(() => {
      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData)
      });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <ThemeProvider theme = {darkTheme}>
        {/* <Meeting.Provider value = {meeting}> */}
          <AuthProvider>
            <AppStateProvider>
            <UserPermissionProvider>
            <MessagingProvider>
              <div className='App-content'>
                <MeetingProvider>
                  <Router>
                      <Switch>
                        <Route path="/:meetingId" children={<Room />} />
                        <Route path="/" children={<Default />} />
                      </Switch>
                  </Router>
                </MeetingProvider>
              </div>
              </MessagingProvider>
              </UserPermissionProvider>
              </AppStateProvider>
              </AuthProvider>
        {/* </Meeting.Provider> */}
      </ThemeProvider>
   </div>
  ):(
    <AmplifyAuthenticator>
      <AmplifySignIn
        federated={{}}
        headerText="My Custom Sign In Text"
        slot="sign-in"
        hideSignUp={true}
      >
        {/* Olá                */}
      </AmplifySignIn>
    </AmplifyAuthenticator>
  ); 
}

export default App;

function Room(){
  const meetingManager = useMeetingManager();
  const [attendee, setAttendee] = useState({});
  const [meeting, setMeeting] = useState({});
  const [connection, setConnection] = useState(false);
  const [token, setToken] = useState('');
  const { meetingId } = useParams();
  // const {
  //   setActiveChannel,
  //   activeChannel,
  // } = useChatChannelState()
  // console.log(activeChannel)
  // console.log(meeting)
  // useEffect(async() => {
  //   if (activeChannel.ChannelArn!=meeting.channel){
  //     let  channel = await describeChannel(meeting.channel, attendee.userId);
  //     setActiveChannel(channel)
  //   }
  // })


  useEffect(()=>{
    async function getToken(){
      let session = await Auth.currentSession()
        if(token !== session.idToken.jwtToken){
          setToken(session.idToken.jwtToken)
        }
        // console.log(token)
    }
    getToken();    
  }, [token])

  const joinMeeting = async (meetingId, token)=>{
    let response = await axios({
      url: 'https://api.yubbe.club/meetings/join',
      method:'get',
      crossDomain: true,
      params:{meetingId},
      headers:{
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type':'application/json',
        'Authorization': token
      }
    }).catch((error)=>{
        console.log(error)
        return undefined
    })
    try{
      const {Meeting, Attendee} = response.data
      setMeeting(Meeting)
      setAttendee(Attendee)
      connect(); 
    }catch(error){
      alert('Erro')
      console.log(error)
    }
  }
  const connect = async (c=0)=>{
    if (c>5){
      return;
    }
    console.log("Tentando conexão")
    c=c+1;
    try{
      await meetingManager.join({meetingInfo: meeting.chime_info.Meeting, attendeeInfo: attendee});
      await meetingManager.start();
      setConnection(true)
    }catch(e){
      if (e instanceof TypeError){
        console.log(e)
        setTimeout(() => {connect(c)}, 1000);
        
      }else{
        console.log(e)
        setConnection(false)
      }
    }
  }
  if(!connection){
    console.log(attendee)
    return (
      <div id='room-container'>
        <h1>Are you ready?</h1>
        <button onClick={()=>{joinMeeting(meetingId, token)}}>Join meeting</button>
        {console.log(meeting)}
        {/* <Channel meetingId={meetingId} userId={attendee.ExternalUserId} channelArn={meeting.channel}/> */}
        {/* <Menu update={uptadeState}>{}</Menu> */}
      </div>          
    )
  }else{
    return (
      <div id='room-container'>
        {/* <h1>Id: {meetingId}</h1> */}
        <MyVideoGrid onLeave={()=>{setConnection(false)}} meeting={meeting} attendee={attendee}/>
        
        {/* <Menu update={uptadeState}>{}</Menu> */}
      </div>          
    )
  }
  
}

      

function Default(){
  return (
    <div className="App">
      <h1>Default</h1>
      
   </div>
  )
}
