import React, { useContext, useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Form ,Spinner} from "react-bootstrap";
import {Context} from '../../components/hooks/UserProfile'
import { useHistory } from "react-router";
import AlertPopup from '../../components/AlertPopup'

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile,update] = useContext(Context);
  const [alert, setAlert]= useState(null);
  const [isLoading, setIsLoading]= useState(false);
  let history= useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
      event.preventDefault();
      setAlert(null);
      setIsLoading(true);
      const url = `/api/users?login`;
      let res= await fetch(url, {
        method: 'POST',
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        referrerPolicy: 'no-referrer', // no-referrer, *client
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
    try{
      let body = await res.json();
      if(res.ok){
        update({
          user:body.info,
          maps: JSON.parse(window.localStorage.getItem("session")).timelines,
          isLoaded: true,
          mapLoaded: false,
        });
      }else{
        if (res.status !== 200){
          setAlert({
            title:"Login Failed",
            variant: "warning",
            body:body.error,
          });
        }
      }
    }catch{
      setAlert({
        title:"Server Error!",
        variant: "danger",
        body: "Connection Failed!",
      });
    }
    setIsLoading(false);
  }
  function loggedIn(){
    setTimeout(()=>{
      history.push('/profile');
    },1000);
    return <p>Welcome {profile.user.username}!</p>;
  }
  function notLoggedIn(){
    return (
      <div>
      <p>Log In</p>
      <Form onSubmit={handleSubmit.bind(this)}>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <div className="spinner">
        {(isLoading)? <Spinner animation="border" />:<Button block disabled={!validateForm()} type="submit">Login</Button>}
        </div>
      </Form>
      </div>
    )
  }
  return (
    <div className="Login">
        {(profile.mapLoaded && profile.user!==null)? loggedIn():notLoggedIn()}
        {(alert)? <AlertPopup title={alert.title} body={alert.body} variant={alert.variant}/>:null}
        {(profile.error)? <AlertPopup title={"Server Error!"} body={profile.error} variant={"danger"}/>:null}
    </div>
  );
}