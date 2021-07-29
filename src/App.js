import React, {useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import { withAuthenticator} from '@aws-amplify/ui-react';
import './App.css';
import MyVideoGrid from './VideoGrid'
import { ThemeProvider } from 'styled-components';
import { darkTheme, MeetingProvider, useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import axios from 'axios'
Amplify.configure(awsconfig);


function App (props){
  return (
    <div className="App">
      <ThemeProvider theme = {darkTheme}>
        {/* <Meeting.Provider value = {meeting}>
          <User.Provider value = {{_id: 0 , name:"Guilherme", role: "adm"}}> */}
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
          {/* </User.Provider> 
        </Meeting.Provider> */}
      </ThemeProvider>
   </div>
  ); 
}

export default withAuthenticator(App);

function Room(){
  const meetingManager = useMeetingManager();
  const [attendee, setAttendee] = useState({});
  const [meeting, setMeeting] = useState({});
  const [, setConnection] = useState({});
  const [token, setToken] = useState('');
  const { meetingId } = useParams();

  
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
      url: 'https://aq42kwrthc.execute-api.us-east-1.amazonaws.com/dev/meeting/join',
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
  const connect = async ()=>{
    console.log("Tentando conexão")
    try{
      await meetingManager.join({meetingInfo: meeting, attendeeInfo: attendee});
      await meetingManager.start();
      setConnection(true)
    }catch(error){
      console.log(error)
      setConnection(false)
    }
  }
  return (
    <>
      <h1>Id: {meetingId}</h1>
      <button onClick={()=>{joinMeeting(meetingId, token)}}>Join</button>
      <MyVideoGrid />
      {/* <Menu update={uptadeState}>{}</Menu> */}
    </>          
  )
}

      

function Default(){
  return (
    <div className="App">
      <h1>Default</h1>
   </div>
  )
}
