import React, { useContext, useState, useEffect } from "react";
import {Context} from '../../components/hooks/UserProfile';



export default function Logout(){
    const [message, setMessage] = useState("Logging off....");
    const [isDone, done] = useState(false);
    // eslint-disable-next-line
    const [profile,update] = useContext(Context);
    window.localStorage.setItem("logging off","true");

    async function callLogout(){
        let res = await fetch("/api/logout", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },err=>alert(err));
        let body= await res.json();
        done(true);
        if(res.ok){
            window.localStorage.setItem("session",JSON.stringify({timelines:[{name:"new"}]}));
            setMessage(body.message);
            update({
                user: null,
                isLoaded: false,
                maps: JSON.parse(window.localStorage.getItem("session")).timelines,
                redirect:'/',
            });
            window.localStorage.removeItem("cur");
            
        }else{
            setMessage(body.error);
        }
    }
    useEffect(()=>{
        if(!isDone&&profile.mapLoaded){
            callLogout()
        }
    })
    return (
        <div className="Logout">
            <br/>
            <p>{(isDone)?message:null}</p>
        </div>
    );
}