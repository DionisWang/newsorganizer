import React, { useContext } from "react";
import {Context} from '../../components/hooks/UserProfile';
import MapList from '../../components/map_list/MapList';
import { useHistory } from "react-router";

export default function Profile() {
    const [profile] = useContext(Context);
    let history= useHistory();
    function loggedIn(){
        return(<>
            <p>Welcome {profile.user.username}!</p>
            <p style={{textAlign:"center"}}>List of Timelines</p>
            <MapList/>
        </>);
    }
    function notLoggedIn(){
        setTimeout(()=>{
            history.push('/login');
        },1000);
        return <p>You are not logged in!</p>;
    }
    if(!profile.isLoaded){
        return <div className="profile">
            <br/>
            <p>Loading...</p>
        </div>;
    }else{
        return <div className="profile">
            <br/>
            {(profile.user!==null)? loggedIn():notLoggedIn()}
        </div>
    }
}