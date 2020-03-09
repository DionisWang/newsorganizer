import React from 'react';

export default function GoogleMapSaveButton(props){
    let textInput=React.createRef();

    let save = ()=>{
        let name = textInput.current.value;
        if(props.user===false){
            alert('Please login to save your timeline!');
            return;
        }else if(name===""){
            alert('Please name your timeline');
            return;
        }else if(name==="default"){
            alert('Invalid Name');
            return;
        }
        window.localStorage.setItem("save",true);
        window.localStorage.setItem("savename",name);
        props.handleSave();
    }

    return (
        <div index={1}>

            <input
            type="text"
            defaultValue={props.baseName}
            ref={textInput} />

            <input
            type="button"
            value="Save"
            onClick={save}
            />
        </div>
    );
}