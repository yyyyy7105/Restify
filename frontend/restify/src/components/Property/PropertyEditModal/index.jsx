import { useState, useContext, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import $ from 'jquery';
import { PropertyDetailContext } from '../../../contexts/PropertyDetailContext';
import PropertyEditForm from '../PropertyEditForm';
import PreviewEditForm from '../PreviewEditForm';
import './style.css';


function PropertyEditModal() {    
    const { prop, setProp } = useContext(PropertyDetailContext);
    const [show, setShow] = useState(false);
    const [showPreviews, setShowPreviews] = useState(false);
    // const navigate = useNavigate();

    const handleShow = (showModel, showPreviews) => () => {
        setShow(showModel);
        setShowPreviews(showPreviews);
    }

    const validatePictureNumber = () => {
        if (prop.preview.length < 3) {
            setShowPreviews(true);
            return false;
        } else {
            handleShow(false, false)();
            // navigate('');
            return true;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        console.log(event.target.elements['image-input'].value)
        const images = event.target.elements['image-input'];
        // append images 
        for (let i = 0; i < images.files.length; i++) {
            formData.append('previews', images.files[i]);
        }
        
        event.target.reset();

        fetch(`http://127.0.0.1:8000/property/${prop.id}/preview/add/`, {
            method: 'PUT', 
            headers: { 'Authorization': `Bearer ` + localStorage.getItem('access') },
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                response.json()
                .then((data) => setProp({...prop, preview: data.preview}));
            } else {
                response.json()
                .then((error) => alert(JSON.stringify(error)));
            }
        })
        .catch(error => console.log(error.message));
    }

    useEffect(() => {
        validatePictureNumber();
        // if (!validatePictureNumber()) {
        //     navigate('#edit-pic');
        // }
    }, []);

    return <>
        <button type="button" className="btn btn-outline-primary w-20 mb-3" onClick={handleShow(true, false)}>
            Update My Listing
        </button>

        <Modal show={show} onHide={handleShow(false, false)}>
        <Modal.Header closeButton>
            <Modal.Title>Edit my property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <PropertyEditForm show={show} setShow={setShow} />
        </Modal.Body>
        <Modal.Footer>
            {/* <Link to='#edit-pic'> */}
            <Button form="edit-prop" variant="outline-secondary" onClick={handleShow(false, true)}>
                Edit pictures
            </Button>
            {/* </Link> */}
            <Button type="reset" form="edit-prop" variant="outline-primary">
                Reset Changes
            </Button>
            <Button type="submit" form="edit-prop" variant="outline-success">
                Save Changes
            </Button>
        </Modal.Footer>
        </Modal>

        <Modal show={showPreviews} onHide={handleShow(false, false)} size='lg' backdrop="static">
        <Modal.Header>
            <Modal.Title>Edit my pictures</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <PreviewEditForm />
            <form id="edit-pic" name="update-prop" className="needs-validation my-2" onSubmit={event => handleSubmit(event)}>
                <label htmlFor="image-input">Select pictures to upload:</label>
                <input className="form-control" type="file" id="image-input" accept="image/*" multiple="multiple" required />
            </form>
            <h6 id="preview-num-warn" style={{color: 'red'}}>
                {
                    prop.preview.length < 3 
                    ? "Please provide at least 3 preview pictures!"
                    : <></>
                }
            </h6>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-success" onClick={validatePictureNumber}>
                Save Changes
            </Button>
            <Button type="submit" form="edit-pic" variant="outline-primary">
                Upload
            </Button>
        </Modal.Footer>
        </Modal>
    </>
}

export default PropertyEditModal;