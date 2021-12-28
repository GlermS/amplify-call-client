import axios from "axios"
import {Auth}  from 'aws-amplify';

export async function pick_random_user(meetingId){
    const resp = await getMeeting({meetingId})
    const users = resp.data.subscribed_users
    return pick_random(users)
}
export async function pick_random_topic(){
    const resp = await listTopics()
    console.log(resp)
    return pick_random(resp.data)
}


export const pick_random = (list) =>{
    let options = list
    const chosen_index = Math.floor(Math.random() * options.length);
  
    return list[chosen_index]
  }

async function getToken(){
    let sessionInfo = await Auth.currentSession()
    return sessionInfo.idToken.jwtToken
}

async function listTopics(){
    const authToken = await getToken()
    
    return await axios({
      url:'https://api.yubbe.club'+'/topics',
      method: 'get',
      crossDomain: true,
      headers: {
            'Authorization': authToken
         }
      }).then((response) => {
        // console.log(response)
        return {data: response.data, status: response.status}
  
    }).catch(error =>{
      return {msg:error, status:401}
    })
  }

async function getMeeting(params){
    const authToken = await getToken()
    return await axios({
        url:'https://api.yubbe.club'+'/meetings/meeting',
        method: 'get',
        crossDomain: true,
        headers: {
            'Authorization': authToken
            },
        params
    }).then((response) => {
        console.log(response)
        return {data: response.data.Item, status: response.status}
    }).catch(error =>{
        return {msg:error, status:401}
    })}