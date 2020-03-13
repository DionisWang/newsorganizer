import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
import {Context} from '../../components/hooks/UserProfile';



export default function Logout(){
    const [message, setMessage] = useState("Logging off....");
    const [isDone, done] = useState(false);
    // eslint-disable-next-line
    const [profile,update] = useContext(Context);
    let history = useHistory();
    async function callLogout(){
        let res = await fetch("/api/logout", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },err=>alert(err));
        let body= await res.json();
        done(true);
        if(res.ok){
            window.localStorage.setItem("session",JSON.stringify({timelines:[{name:"new"}]}));
            update({
                user: null,
                maps: JSON.parse(window.localStorage.getItem("session")).timelines,
            });
            setMessage(body.message);
            window.localStorage.removeItem("cur");
            setTimeout(()=>{
                history.push('/');
            },1000);
        }else{
            setMessage(body.error);
        }
    }
    useEffect(()=>{
        if(!isDone&&profile.mapLoaded){
            callLogout();
        }
    })
    return (
        <div className="Logout">
            <br/>
            <p>{message}</p>
        </div>
    );
}