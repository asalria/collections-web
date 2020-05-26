import React, {useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, InputGroup, Form, Alert, Toast} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faLock, faLockOpen, faPlus, faMinus, faThumbsUp} from '@fortawesome/free-solid-svg-icons'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastAux = ({toggleToast}) => {

/*     useEffect(() => {
        console.log("!")
        toast('🦄 Wow so easy!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
      }, []); */

    return (
        //<ToastContainer />
<div
  aria-live="polite"
  aria-atomic="true"
  style={{
    position: 'relative',
    minHeight: '200px',
  }}
>
  <div
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
    }}
  >
    <Toast show onClose={toggleToast} autohide>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
        <strong className="mr-auto">Bootstrap</strong>
        <small>just now</small>
      </Toast.Header>
      <Toast.Body>See? Just like this.</Toast.Body>
    </Toast>
    <Toast>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
        <strong className="mr-auto">Bootstrap</strong>
        <small>2 seconds ago</small>
      </Toast.Header>
      <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
    </Toast>
  </div>
</div>
    )

}



export default ToastAux;