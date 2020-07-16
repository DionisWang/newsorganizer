import React, {useContext} from 'react';
import { Navbar, Nav, NavDropdown} from "react-bootstrap";
import useWidth from '../../hooks/Resize';
import SearchBar from './SearchBar';
import {Context} from '../../hooks/UserProfile'
import './Navbar.css';


export default function MyNavbar(){
    const [profile] = useContext(Context);
    // eslint-disable-next-line
    let width=useWidth();
    function titler(){
        if(!profile.isLoaded){
            return "User"
        }else{
            if(profile.user===null||window.localStorage.getItem("logging off")){
                return "User"
            }else{
                return profile.user.username;
            }
        }
    }
    return(
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" sticky="top">
            <Navbar.Brand href="/">News Organizer</Navbar.Brand>
            <SearchBar/>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="/news">News</Nav.Link>
                    <Nav.Link href="/timeline">Timeline</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    
                    <NavDropdown alignRight className="Nav Nav-link" title={titler()} id="collasible-nav-dropdown">
                        {(profile.isLoaded&& profile.user!==null) 
                            ?(<>
                                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
                            </>)                        
                            :(<>
                                <NavDropdown.Item href="/login">Log In</NavDropdown.Item>
                                <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
                            </>)
                        }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}