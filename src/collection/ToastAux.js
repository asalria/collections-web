import React, {useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, InputGroup, Form, Alert, Toast} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faLock, faLockOpen, faPlus, faMinus, faThumbsUp} from '@fortawesome/free-solid-svg-icons'

import {listByUserCol, addBook, removeBook, create} from './apiCollection';
import { isAuthenticated } from "../auth";

const ToastAux = ({toggleToast}) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingCollections, setExistingCollections] = useState([])
    const [selectedCollections, setSelectedCollections] = useState([])
    const [show, setShow] = useState(false)
    const [totalCollAdd, setTotalCollAdd] = useState(0)
    const [totalCollRem, setTotalCollRem] = useState(0)
    const collectionData = new FormData();



    return (
        <Modal show className="modal-s" onHide={toggleToast}>
        <Modal.Header closeButton>
        <Modal.Title>Toast</Modal.Title>
        </Modal.Header>
        </Modal>
    )

}



export default ToastAux;