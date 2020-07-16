import React from 'react';
import UserProfile from '../hooks/UserProfile';
import MyNavbar from './navbar';

import News from '../../routes/news/News';
import Timeline from '../../routes/timeline/Timeline';
import Home from '../../routes/home/Home';
import Login from '../../routes/login/Login';
import Logout from '../../routes/logout/Logout';
import Signup from '../../routes/signup/Signup';
import Profile from '../../routes/profile/Profile';
import About from '../../routes/about/About';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
        <UserProfile>
        <MyNavbar/>
        <Switch>
          <Route exact key="news" path="/news" component={News}/>
          <Route exact key="timeline" path="/timeline" component={Timeline}/>
          <Route exact key="home" path="/" component={Home}/>
          <Route exact key="about" path="/about" component={About}/>
          <Route exact key="login" path="/login" component={Login}/>
          <Route exact key="profile" path="/profile" component={Profile}/>
          <Route exact key="logout" path="/logout" component={Logout}/>
          <Route exact key="signup" path="/signup" component={Signup}/>
        </Switch>
        </UserProfile>
    </Router>
  )
}


export default App;
