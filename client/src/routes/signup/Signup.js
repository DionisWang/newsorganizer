import React, { useState, useContext } from "react";
import { Button, FormGroup, FormControl, FormLabel, Form, Spinner} from "react-bootstrap";
import {Context} from '../../components/hooks/UserProfile';
import AlertPopup from '../../components/AlertPopup';
import { useHistory } from "react-router";



export default function Signup(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //const [confirmationCode, setConfirmationCode] = useState("");
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert]= useState(null);
    const [profile] = useContext(Context);
    let history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();
        setAlert(null);
        const url = `/api/users?signup`;
        setIsLoading(true);
        let res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password:password,
            }),
        })
        if(res.ok){
            setNewUser(username);
            setAlert({
                variant:"success",
                title:`Welcome ${username}`,
                body:`Please login to continue!`,
            })
        }else{
            try{
                let body= await res.json();
                let err= body.error;
                setAlert({
                    variant:"warning",
                    title:`Login Error`,
                    body: err,
                });
            }catch{
                setAlert({
                    variant:"danger",
                    title:`Server Error!`,
                    body: "Connection Failed",
                });
            }
            
        }
        setIsLoading(false);
    }
    
    /*
    function validateConfirmationForm() {
        return confirmationCode.length > 0;
    }

    
    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
        setIsLoading(false);

    }

    function renderConfirmationForm() {
        return (
        <Form onSubmit={handleConfirmationSubmit}>
            <FormGroup>
            <FormLabel>Confirmation Code</FormLabel>
            <FormControl
                autoFocus
                type="tel"
                onChange={e =>setConfirmationCode(e.target.value)}
                value={confirmationCode}
            />
            <Alert variant="success">
                <p>Please check your email for the code.</p>
            </Alert>
            </FormGroup>
            {(isLoading)? <Spinner animation="border" />:<Button block disabled={!validateConfirmationForm()} type="submit">Verify</Button>}
            
        </Form>
        );
    }
    */
    function redirect(){
        setTimeout(()=>{
            history.push('/login');
        },3000);
    }
    function validateForm() {
        return (
            username.length>0 &&
            email.length > 0 &&
            password.length > 0 &&
            password === confirmPassword
        );
    }
    function renderForm() {
        return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormControl
                autoFocus
                type="username"
                value={username}
                onChange={e =>setUsername(e.target.value)}
            />
            </FormGroup>
            <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormControl
                autoFocus
                type="email"
                value={email}
                onChange={e =>setEmail(e.target.value)}
            />
            </FormGroup>
            <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
                type="password"
                value={password}
                onChange={e =>setPassword(e.target.value)}
            />
            </FormGroup>
            <FormGroup>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
                type="password"
                onChange={e =>setConfirmPassword(e.target.value)}
                value={confirmPassword}
            />
            </FormGroup>
            <div className="spinner">
                {(isLoading)? <Spinner animation="border" />:<Button block disabled={!validateForm()} type="submit">Sign Up</Button>}
            </div>
        </Form>
        );
    }

    return (
        <div className="Signup">
            <p>Sign Up</p>
            {((profile.mapLoaded && profile.user!==null)||newUser!==null)? redirect():renderForm()}
            {(alert)? <AlertPopup title={alert.title} body={alert.body} variant={alert.variant}/>:null}
            {(profile.error)? <AlertPopup title={"Server Error!"} body={profile.error} variant={"danger"}/>:null}
        </div>
    );
}