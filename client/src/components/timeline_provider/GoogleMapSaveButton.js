import React,{useState} from 'react';
import { FormControl, Button, Form, InputGroup } from "react-bootstrap";
import AlertPopup from '../AlertPopup'

export default function GoogleMapSaveButton(props){
    const[alert,setAlert]=useState(null);
    let textInput=React.createRef();

    let save = (e)=>{
        e.preventDefault()
        let name = textInput.current.value;
        if(name===""){
            name=props.baseName;
        }
        if(props.user===false){
            setAlert({
                variant: "warning",
                title: "Failed to save",
                body: 'Please login to save your timeline!',
            });
            return;
        }else if(name===""){
            setAlert({
                variant: "warning",
                title: "Failed to save",
                body: "Please name your timeline",
            });
            return;
        }else if(name==="new"){
            setAlert({
                variant: "warning",
                title: "Failed to save",
                body: "Please give your timeline a valid name. (\"new\" is reserved)",
            });
            return;
        }
        window.localStorage.setItem("save",true);
        window.localStorage.setItem("savename",name);
        props.handleSave();
    }

    return (
        <div>
            <Form onSubmit={e=>save(e)} id="saver">
                <InputGroup size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder={props.baseName} ref={textInput}/>
                    <InputGroup.Append>
                        <Button variant="primary" type = "submit">Save</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
            {(alert)?<AlertPopup title={alert.title} body={alert.body} variant={alert.variant}/>:null}
        </div>
    );
}