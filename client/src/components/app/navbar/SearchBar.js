import React, { useState } from "react";
import { useHistory } from "react-router";
import { FormControl, Button, Image, Form, InputGroup } from "react-bootstrap";
import s_icon from '../../../images/search_icon.svg';


export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    let history = useHistory()

    function handleSubmit(e) {
        e.preventDefault();
        console.log(`submitted search: ${searchTerm}`);
        history.push(`/news?q=${encodeURIComponent(searchTerm)}`);
        let queryStringChange = new Event('popstate');
        window.dispatchEvent(queryStringChange);
    }

    return (
        <div className="searchbar">
        <Form onSubmit={e=>handleSubmit(e)} className="my-auto">
        <InputGroup>
            <FormControl id="search" type="text" placeholder="Search" aria-label="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <InputGroup.Append>
                <Button variant="dark" type = "submit">
                    <Image alt="search button" src={s_icon} rounded />
                </Button>
            </InputGroup.Append>
        </InputGroup>
        </Form>
        </div>
    )
}