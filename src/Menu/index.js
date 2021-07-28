import React, {useState, useContext, useEffect } from 'react';
import axios from 'axios'
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import {User} from '../context'

export default function Menu (props){
  const meetingManager = useMeetingManager();
  const [meetingsList, setMeetingsList] = useState([]);
  const [meeting, setMeeting] = useState([]);
  const user = useContext(User)

  useEffect(()=>{
    let meet = document.getElementById('meeting')
    let i  = meet.value 
    setMeeting(meetingsList[i])
  }, [meetingsList])

  async function getMeeting(){
    let response = await axios({
      url: 'https://lledi0758e.execute-api.sa-east-1.amazonaws.com/BETA/call',
      method:'get',
      crossDomain: true,
      headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Credentials': true}})
    
    if (response.data){
      await listMeetings()
    }
  }

  async function getAttendeeCredentials (){
    var joinData = null
    console.log(meeting)
    let response = await axios({
      url: 'https://lledi0758e.execute-api.sa-east-1.amazonaws.com/BETA/call',
      method:'post',
      crossDomain: true,
      data: {MeetingId: meeting, UserId: user._id},
      headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Credentials': true}}).catch((error)=>{
        console.log(error)
      })
    
    if (response.data){
      joinData = response.data
    }
    console.log(joinData)
    return joinData 
  }

 

  const joinMeeting = async () => {
      try{
        const joinData = await getAttendeeCredentials()        
        console.log(joinData)
        props.update({Meeting: joinData.Meeting})
        await meetingManager.join({meetingInfo: joinData.Meeting, attendeeInfo: joinData.Attendee});
        await meetingManager.start();
    }catch(error){
      alert('Erro')
      console.log(error)
    }
  }

  const listMeetings = async ()=>{
    let response = await axios({
      url: 'https://lledi0758e.execute-api.sa-east-1.amazonaws.com/BETA/meetings-list',
      method:'get',
      crossDomain: true,
      headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Credentials': true}})
    
    if (response.data){
      setMeetingsList(response.data.Meetings?response.data.Meetings:['empty'])
    }
  }

  const selectMeeting = async (event) => {
    setMeeting(meetingsList[event.target.value])
  }

  return (
  <div className='side-bar menu'>
    <button onClick={getMeeting}>New</button>
    <button onClick={joinMeeting}>Join</button>

    <button onClick={listMeetings}>List calls</button>
    <select onChange={selectMeeting} name="meetings" id="meeting">
      {meetingsList.map((meeting, i)=><option value={i} key = {i}>{meeting}</option>)}
    </select>
    {meeting}
  </div>)
};

