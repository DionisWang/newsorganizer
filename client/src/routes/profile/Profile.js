import React, { useContext } from "react";
import {Context} from '../../components/hooks/UserProfile';
import TableManager from '../../components/table/TableManger'
import { useHistory } from "react-router";

export default function Profile() {
    const [profile] = useContext(Context);
    let history= useHistory();
    function loggedIn(){
        return(<>
            <p>Welcome {profile.user.username}!</p>
            <p style={{textAlign:"center"}}>List of Timelines</p>
            <TableManager/>
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