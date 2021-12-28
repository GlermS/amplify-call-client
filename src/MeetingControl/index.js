import {
    useMeetingManager ,
    useLocalAudioOutput,
    useToggleLocalMute,
    useLocalVideo
  } from 'amazon-chime-sdk-component-library-react';
import "./meeting-control.css"

export default function MeetingControl (props){
    const { isAudioOn, toggleAudio } = useLocalAudioOutput();
    const { muted, toggleMute       }    = useToggleLocalMute()
    const { isVideoEnabled ,toggleVideo } = useLocalVideo();
    const meetingManager = useMeetingManager ();
    const {showChatBox, setShowChatBox} = props.display
    // useEffect(()=>{
    //     if (isVideoEnabled != ligarCamera){
    //       toggleVideo()
    //     }})
    
    function buttonColor(state){
        if(state){
            return {'backgroundColor':"#0F0F0F", 'color':"#F0F0F0", 'textDecoration':'none','border': 'none'}
        }else{
            return {'backgroundColor':"#F0F0F0", 'color':"#0F0F0F", 'textDecoration':'none','border': 'none'}
        }
    }

    return (
        <div id="meeting-control">
            <button onClick={()=>{setShowChatBox('block')}}>Chat</button>
            <button onClick={toggleVideo} style={buttonColor(isVideoEnabled)}>Camera</button>
            <button onClick={toggleMute} style={buttonColor(muted)}>Mic</button>
            <button onClick = {()=>{meetingManager.leave(); props.onLeave()}}>Sair</button>
        </div>
    );
}