import { useState, useContext } from 'react';
import { ImCross } from 'react-icons/im';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { PropertyDetailContext } from '../../../contexts/PropertyDetailContext';
import './pefstyle.css';


function PreviewEditForm() {    
    const { prop, setProp } = useContext(PropertyDetailContext);
    const [ warnPreviewID, setWarnPreviewID ] = useState(0);  // only warn if preview id > 0
    
    const handleDelete = (preview_id) => () => {
        fetch(`http://127.0.0.1:8000/property/preview/${preview_id}/delete/`, {
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ` + localStorage.getItem('access') },
        })
        .then(response => {
            if (response.ok) {
                const newPreviews = prop.preview.filter(item => item.id !== preview_id);
                setProp({...prop, preview: newPreviews});
            } else {
                response.json()
                .then((error) => alert(JSON.stringify(error)));
            }
        })
        .catch(error => console.log(error.message))
        .finally(() => setWarnPreviewID(0));
    }

    const handleShowWarn = (preview_id) => () => {
        setWarnPreviewID(preview_id);
    }

    return <>
    <div className="container">
        <div className="row">

        {
            prop.preview.map(preview => (
                <div key={preview.id} id={`preview_${preview.id}`} className="col-6 border-0 p-1">
                    <div className="listing-edit-img">
                    <img src={"http://127.0.0.1:8000" + preview.image} className="card-img-top" />
                    <Button onClick={handleShowWarn(preview.id)} className="delete-button"
                        style={
                            {backgroundColor: 'white', display: "flex", justifyContent: "center", alignItems: "center", height: "4vh", width: "4vh"}
                        }>
                        
                        <ImCross className="cross-icon" style={{color: 'red'}}/>
                    </Button>
                    </div>
                </div>
            ))
        }

        </div>
    </div>
    <Modal show={warnPreviewID > 0} onHide={handleShowWarn(0)}>
        <Modal.Header closeButton>
            <Modal.Title >Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h5 className='warning'>Are you sure you want to delete this preview?</h5>
        </Modal.Body>
        <Modal.Footer>
            <div>
                <Button onClick={handleShowWarn(0)} variant='outline-secondary' className='me-3'>
                    Discard
                </Button>
                <Button onClick={handleDelete(warnPreviewID)} variant='outline-danger'>
                    Confirm Delete
                </Button>
            </div>
        </Modal.Footer>
        </Modal>
    </>;
}

export default PreviewEditForm;