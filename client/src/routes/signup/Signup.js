import React, { useState } from "react";
import {Alert, Button, FormGroup, FormControl, FormLabel, Form, Spinner} from "react-bootstrap";

export default function Signup(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            username.length>0 &&
            email.length > 0 &&
            password.length > 0 &&
            password === confirmPassword
        );
    }

    function validateConfirmationForm() {
        return confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const url = `/api/users?signup`;
        setIsLoading(true);
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password:password,
            }),
        }).then(async (res)=>{
            let body = await res.json();
            if(res.ok){
                console.log(body);
                setNewUser(body.username);
            }else{
                if (res.status !== 200){
                    alert(body.error);
                }
            }
        },(err)=>{
            alert(err);
        });
        setIsLoading(false);
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
            {(isLoading)? <Spinner animation="border" />:<Button block disabled={!validateForm()} type="submit">Sign Up</Button>}
        </Form>
        );
    }

    return (
        <div className="Signup">
            <p>Sign Up</p>
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}