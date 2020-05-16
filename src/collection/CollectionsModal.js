import React, { Component } from "react";
import DefaultCollection from "../images/mountains.jpg";
import { singleBook, remove, like, unlike } from '../book/apiBook';
import {listByUserCol, addBook, removeBook, create} from './apiCollection';
import DefaultBook from '../images/mountains.jpg';
import {Modal, Button, InputGroup, Form, Alert, Toast} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faLock, faLockOpen, faPlus, faMinus, faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import { isAuthenticated } from '../auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class CollectionsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
            show: false ,
            book: {},
            visible: false,
            totalCollectionsRemoved: 0,
            totalCollectionsRemoved: 0,
            alert: false,
            setShow: false
        };
    }



componentDidMount = () =>
{    this.setState({show: this.props.show, book: this.props.book});
    if(this.props.show == true){
        this.getCollections();
    }
    console.log(this.props)
    
}

componentDidUpdate() {
    console.log(this.props)

    if(this.state.show !== this.props.show && this.props.book._id) {
        this.setState({show: this.props.show})
        this.getCollections();
    }

    
}

handleToast=() => {
   
    this.setState({show: false, showForm: false},
        () => toast("Wow so easy !")
        ); 
}

handleClose = (e) => {

/*         this.setState({show: false, showForm: false}, () => {
            this.props.onClose && this.props.onClose(e);

        }) */

        this.setState({show: false, showForm: false});
        this.handleExit();
        


}

handleExit = (e) => {
    
        this.props.onClose && this.props.onClose(e);

}

onClose = e => {
    this.props.show = false;
  };

handleCloseAlert = (e) => {
    this.setState({visible: false})
    this.props.onClose && this.props.onClose(e);
}

saveChanges = () => {

    this.handleClose();
}

handleOpen = () => {
    this.getCollections();
}

handleChange = (e) => {
    e.persist();

    if(e.target.checked) {
    console.log(e.target.value)
    this.setState(({selectedCollections}) => ({
        selectedCollections: [...selectedCollections, e.target.value]
      }));
      /*
    this.setState((state, props) => {
        return {selectedCollections: state.selectedCollections.push(e.target.value)};
    }, console.log(this.state.selectedCollections));


     this.setState(prevState => ({
        selectedCollections: prevState.selectedCollections.push(e.target.value)
      }), console.log(this.state.selectedCollections)); */

    } else {
            console.log("OUT")
            console.log("")
            var array = [ ...this.state.selectedCollections];
            var index = this.state.selectedCollections.indexOf(e.target.value)
            if (index !== -1) {
            array = array.splice(index,1)
            //arr = this.state.selectedCollections.filter(item => item !== e.target.value)
            console.log(index)
            let arrayAux = [];
            let i = 0;
            
            this.setState(prevState => ({
                selectedCollections: prevState.selectedCollections.filter(item => item !== e.target.value)
              }), console.log(this.state.selectedCollections));
            }

    }

   

}

submitForm = (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    this.collectionData = new FormData();
    let remove = this.state.existingCollections.filter(x => !this.state.selectedCollections.includes(x));
    let add = this.state.selectedCollections.filter(x=> !this.state.existingCollections.includes(x));


    this.setState({totalCollectionsRemoved: remove.length, totalCollectionsAdded: add.length})

    add.forEach(collection => {
        addBook(isAuthenticated().user._id, isAuthenticated().token, collection, this.props.book._id)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data)
            }
        });

    })

    remove.forEach(collection => {
        removeBook(isAuthenticated().user._id, isAuthenticated().token, collection, this.props.book._id)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data)
            }
        })
    });

    if (data.get('collectionName') != undefined){
        this.collectionData.set('name', data.get('collectionName'));
        this.collectionData.set('privacy', data.get('collectionPrivacy'));
        create(isAuthenticated().user._id, isAuthenticated().token, this.collectionData)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                
                    addBook(isAuthenticated().user._id, isAuthenticated().token, data._id, this.props.book._id)
                    .then(result => {
                        if (result.error) {
                            console.log(result.error);
                        } else {
                            
                            this.handleToast();
                        }
                    });
            }
        });

    } else {
        if(add.length>0 || remove.length>0){
            this.handleToast();
        } else {
            this.handleClose();
        }
        
        
    }
    
      
}

getCollections = () => {
    console.log("ggg")

    this.setState({ loadingModal: true });
    const userId = isAuthenticated().user._id;
    const {token} = isAuthenticated();
    let existing = [];
    const bookId = this.props.book._id;
    listByUserCol(userId,token)
    .then(data => {
        if(data.error){
            console.log(data.error);
        } else {
            data.forEach(collection => {
                
                collection.books.forEach(book=> {
                    if(book._id === bookId){
                        existing.push(collection._id)
                        }
                })

                
//                    console.log(collection.books.filter(book=> book._id === bookId))
            });
            const aux = existing.slice();
            this.setState({collections: data, selectedCollections: existing.slice(), loadingModal: false});
            this.setState({existingCollections: aux.slice()});
        }
    });

}

onShowAlert = ()=>{
    toast('🦄 Wow so easy!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

/*     this.setState({visible:true},()=>{
      window.setTimeout(()=>{
        this.setState({visible:false})
      },2000)
    }); */
  }

  showCreate = () => {
    this.setState({showForm: !this.state.showForm});
  }

render () {
    if(!this.props.show){
        return null;
    }
    const bookerId = this.state.book.createdBy ? `/user/${this.state.book.createdBy._id}` : '';
    const bookerName = this.state.book.createdBy ? this.state.book.createdBy.name : ' Unknown';
    const aux = [];

    const { like, likes, show, collections, showForm, comments, loading, loadingModal, book, alert, selectedCollections} = this.state;
    console.log(this.state.selectedCollections)
   return (
       <>
{/*     <Modal show={alert} className="modal-s" onHide={this.handleExit}>
    <Modal.Header closeButton>
    <Modal.Title>Collection modified</Modal.Title>
    </Modal.Header>     
    </Modal> */}
    <ToastContainer />
    <Modal show={show} className="modal-m" onHide={this.handleExit}>
    <Modal.Header closeButton>
    <Modal.Title>Select collections:</Modal.Title>
</Modal.Header>
<Form onSubmit={this.submitForm}>
<Modal.Body>
{loadingModal && collections.length == 0 ? (
   <Modal.Title>Loading...</Modal.Title>
) : (

collections.map((collection, i) => (
            <div key={i}>
            <Form.Group>
                <div className="row">
                    <div className="col-10">
                    <Form.Check className="ml-4" onChange={this.handleChange} value={collection._id} type="checkbox" name={collection._id} label={collection.name} defaultChecked={selectedCollections.includes(collection._id)} />
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

<Button variant="secondary" onClick={this.showCreate}><FontAwesomeIcon className="mr-2" icon={!showForm ? faPlus : faMinus} />
    Create Collection
</Button>
{ !showForm ? null :
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
    <Button variant="secondary" onClick={this.handleExit}>
    Close
</Button>
<Button variant="primary" type="submit">
    Save Changes
</Button>
    </Modal.Footer>
    </Form>
</Modal>
</>
   )
}

}

export default CollectionsModal;