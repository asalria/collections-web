import React, {useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, InputGroup, Form, Alert, Toast} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faLock, faLockOpen, faPlus, faMinus, faThumbsUp} from '@fortawesome/free-solid-svg-icons'

import {listByUserCol, addBook, removeBook, create} from './apiCollection';
import { isAuthenticated } from "../auth";
import useModal from './useModal'
import useToast from './useToast';


const ModalAux = ({book, toggle}) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingCollections, setExistingCollections] = useState([])
    const [selectedCollections, setSelectedCollections] = useState([])
    const [show, setShow] = useState(false)
    const [totalCollAdd, setTotalCollAdd] = useState(0)
    const [totalCollRem, setTotalCollRem] = useState(0)
    const collectionData = new FormData();
    const {toggleToast} = useModal();






    useEffect(() => {
        getCollections();
      }, []);

      const getCollections = () => {        
        setLoading(true)
        const userId = isAuthenticated().user._id;
        const {token} = isAuthenticated();
        let existing = [];
        const bookId = book._id;
        listByUserCol(userId,token)
        .then(data => {
            if(data.error){
                console.log(data.error);
            } else {
                console.log(data)
                data.forEach(collection => {
                    console.log(collection)
                    collection.books.forEach(book=> {
                        if(book._id === bookId){
                            existing.push(collection._id)
                            }
                    })
    
                    
    //                    console.log(collection.books.filter(book=> book._id === bookId))
                });
                const aux = existing.slice();
                
                setCollections(data)
                setExistingCollections(aux.slice())
                setSelectedCollections(existing.slice())
                setLoading(false)

                console.log(collections)
                
            }
        });
    
    }

    const handleToast = (remove,add) => {
        console.log("ASF")
        toggleToast()
    }

    const submitForm = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let remove = existingCollections.filter(x => !selectedCollections.includes(x));
        let add = selectedCollections.filter(x=> !existingCollections.includes(x));
    
        setTotalCollRem(remove.length)
        setTotalCollAdd(add.length)
    
        add.forEach(collection => {
            addBook(isAuthenticated().user._id, isAuthenticated().token, collection, book._id)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data)
                }
            });
    
        })
    
        remove.forEach(collection => {
            removeBook(isAuthenticated().user._id, isAuthenticated().token, collection, book._id)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data)
                }
            })
        });
    
        if (data.get('collectionName') != undefined){
            collectionData.set('name', data.get('collectionName'));
            collectionData.set('privacy', data.get('collectionPrivacy'));
            create(isAuthenticated().user._id, isAuthenticated().token, collectionData)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    
                        addBook(isAuthenticated().user._id, isAuthenticated().token, data._id, book._id)
                        .then(result => {
                            if (result.error) {
                                console.log(result.error);
                            } else {
                                
                                handleToast(remove,add);
                            }
                        });
                }
            });
    
        } else {
            if(add.length>0 || remove.length>0){
                handleToast(remove,add);
            } else {
                toggle();
            }
            
            
        }
        
          
    }
    const showForm = () => {
        setShow(!show);
    }
    const handleChange = (e) => {
        e.persist();
    
        if(e.target.checked) {
        console.log(e.target.value)
        setSelectedCollections(prevArray => [...prevArray, e.target.value])
        } else {
                console.log("OUT")
                console.log("")
                var index = selectedCollections.indexOf(e.target.value)
                if (index !== -1) {
                setSelectedCollections(prevArray => prevArray.filter(item => item !== e.target.value))
                }

                console.log(selectedCollections)
    
        }
    
       
    
    }

    return (
        <Modal show className="modal-s" onHide={toggle}>
        <Modal.Header closeButton>
        <Modal.Title>Select collections:</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitForm}>
        <Modal.Body>
        {loading && collections.length == 0 ? (
        <Modal.Title>Loading...</Modal.Title>
        ) : (
        collections.map((collection, i) => (
            <div key={i}>
            <Form.Group>
                <div className="row">
                    <div className="col-10">
                    <Form.Check className="ml-4" onChange={handleChange} value={collection._id} type="checkbox" name={collection._id} label={collection.name} defaultChecked={selectedCollections.includes(collection._id)} />
                    </div>
                    <div className="col-2">
                    <FontAwesomeIcon icon={collection.privacy=="private" ? faLock : faLockOpen} />
                    </div>

                </div>
            </Form.Group>
          </div>
        ))
        )}

<hr className="dashed"></hr>

<Button variant="secondary" onClick={showForm}><FontAwesomeIcon className="mr-2" icon={!show ? faPlus : faMinus} />
    Create Collection
</Button>
{ !show ? null :
<>
<Form.Group controlId="collectionName">
        <Form.Label className="">Name</Form.Label>
        <Form.Control type="text" name="collectionName" placeholder="Collection name" />
    </Form.Group>
<Form.Group controlId="collectionPrivacy">
    <Form.Label>Privacy</Form.Label>
    <Form.Control as="select" name="collectionPrivacy">
        <option value="private">Private</option>
        <option value="public">Public</option>
        <option value="followPrivate">Public to followers</option>
    </Form.Control>
</Form.Group>
</>
}
</Modal.Body>
<Modal.Footer>
    <Button variant="secondary" onClick={toggle}>
    Close
</Button>
<Button variant="primary" type="submit">
    Save Changes
</Button>
    </Modal.Footer>
    </Form>
</Modal>
    )

}



export default ModalAux;