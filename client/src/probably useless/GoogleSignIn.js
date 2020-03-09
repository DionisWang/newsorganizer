import React, { Component } from 'react';


class GoogleSignIn extends Component{
    auth2= null;
    constructor(){
        super();
        this.state={
            loggedin: false,
            curUser: null,
            
        };
    };
    componentDidMount() {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: "854817542796-pn5iu3jsjnmitdrrrr03l8vbpn01nfgf.apps.googleusercontent.com",
                cookiepolicy: 'single_host_origin',
            })
            .then((auth2) => {
                this.auth2=auth2;
                this.auth2.isSignedIn.listen(this.signinChanged.bind(this));
                this.auth2.currentUser.listen(this.userChanged.bind(this));
                if(auth2.isSignedIn.get()){
                    this.userChanged(auth2.currentUser.get())
                    this.profile=this.state.curUser.getBasicProfile();
                    this.signinChanged(true);
                    console.log("already signed in");
                    setTimeout(()=>{
                        console.log("logging out");
                        auth2.signOut();
                    },5000);
                }
            },()=>{
                alert('Please enable cookies to enable login');
                return;
            })
        }) 
    };
    signinChanged(signedIn){
        this.setState({loggedin:signedIn});
    }
    userChanged(newUser){
        this.setState({curUser:newUser});
    }
    onSuccess(googleUser) {
        console.log('login success')
        this.profile = googleUser.getBasicProfile();
        console.log('ID: ' + this.profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + this.profile.getName());
        console.log('Image URL: ' + this.profile.getImageUrl());
        console.log('Email: ' + this.profile.getEmail()); // This is null if the 'email' scope is not present.
    };
    onFailure() {
        console.log('login failed');
    };
    render() {
        if(this.state.loggedin){
            return (
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.profile.getName()}
                </button>
                <div className="dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                    <div className="dropdown-item" href="#">Log Out</div>
                </div>
            </div>
            )
        }else{
            setTimeout(()=>{
                window.gapi.signin2.render('g-signin2', {
                    'scope': 'profile email',
                    'longtitle': false,
                    'theme': 'dark',
                    'onsuccess': this.onSuccess.bind(this),
                    'onfailure': this.onFailure.bind(this),
                });
            });
            return <div className="sign-in" id="g-signin2"></div>;
        }
    }
}

export default GoogleSignIn;