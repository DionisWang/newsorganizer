import React, { useState } from "react";
import {Modal} from "react-bootstrap";


export default function AlertPopup(props) {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
        
    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title className={`text-${props.variant}`}>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.body}</Modal.Body>
        </Modal>
        </>
    );
}