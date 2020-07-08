import React from 'react';
import {Route} from "react-router-dom";


function App() {
  return (
      <Router>
          <Route exact key="news" path="/news" />
          <Route exact key="timeline" path="/timeline" />
          <Route exact key="home" path="/" />
          <Route exact key="about" path="/about" />
          <Route exact key="login" path="/login" />
          <Route exact key="profile" path="/profile" />
          <Route exact key="logout" path="/logout" />
          <Route exact key="signup" path="/signup" />
      </Router>
  )
}


export default App;