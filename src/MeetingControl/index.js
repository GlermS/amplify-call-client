import {
    useMeetingManager ,
    useLocalAudioOutput,
    useLocalVideo
  } from 'amazon-chime-sdk-component-library-react';
import "./meeting-control.css"

export default function MeetingControl (props){
    const { isAudioOn, toggleAudio } = useLocalAudioOutput();
    const { isVideoEnabled ,toggleVideo } = useLocalVideo();
    const meetingManager = useMeetingManager ();

    // useEffect(()=>{
    //     if (isVideoEnabled != ligarCamera){
    //       toggleVideo()
    //     }})
    
    function color(state){
        if(state){
            return "#0F0F0F"
        }else{
            return "#F0F0F0"
        }
    }

    return (
        <div id="meeting-control">
            <button onClick={toggleVideo} style={{'backgroundColor':color(isVideoEnabled), 'textDecoration':'none','border': 'none'}}>Camera</button>
            <button onClick={toggleAudio} style={{'backgroundColor':color(isAudioOn), 'textDecoration':'none','border': 'none'}}>Mic</button>
            <button onClick = {()=>{meetingManager.leave(); props.onLeave()}}>Sair</button>
        </div>
    );
}