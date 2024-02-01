import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Rating } from 'react-simple-star-rating';
import { ImCross } from 'react-icons/im';

function PropertyListCard({ props, setProps, host }) {
    const [ warnProp, setWarnProp ] = useState(0);  // only warn if prop_id > 0

    const handleShowWarn = (prop) => () => {
        setWarnProp(prop);
    }

    const handleDelete = (prop_id) => () => {
        fetch(`http://127.0.0.1:8000/property/${prop_id}/delete/`, {
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ` + localStorage.getItem('access') },
        })
        .then(response => {
            if (response.ok) {
                // const newProps = props.filter(item => item.id !== prop_id);
                // setProps(newProps);
                window.location.reload(true);
            } else {
                response.json()
                .then((error) => alert(JSON.stringify(error)));
            }
        })
        .catch(error => console.log(error.message))
        .finally(() => setWarnProp(0));
    }

    return <> 
    {
    props.map(prop => (
        <div key={prop.id} className="col border-0 mb-5 index-width">
        <div className="card big property-list">
            <Link to={"/property/" + prop.id + "/detail"} className="stretched-link"></Link>
            <img className="index-img card-img-top w-100"
                src={prop.preview.length ? "http://127.0.0.1:8000" + prop.preview[0].image : ""} alt=""/>
            {
                host.id
                // host == 0
                ? <Button onClick={handleShowWarn(prop.id)} className="delete-button"
                    style={
                        {backgroundColor: 'white', display: "flex", justifyContent: "center", alignItems: "center", height: "4vh", width: "4vh"}
                    }>
                    
                    <ImCross className="cross-icon" style={{color: 'red'}}/>
                </Button>
                : <></>
            }
            
            <div className="card-body">
                
                <div className="d-flex justify-content-between" style={{height: "35%"}}>
                    <h6 className="mb-0">{prop.name}</h6>
                    <div className='mb-2'>
                        <Rating initialValue={prop.rating} size="18px" readonly />
                    </div>
                </div>
                <div>
                    <p>{prop.country}</p>
                    <p>{prop.capacity} guests</p>
                    <p>${prop.price} per day</p>
                </div>
            </div>
        </div>
        </div>
    ))
    }
    <Modal show={warnProp > 0} onHide={handleShowWarn(0)}>
    <Modal.Header closeButton>
        <Modal.Title >Alert</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <h5 className='warning'>Are you sure you want to delete this property?</h5>
    </Modal.Body>
    <Modal.Footer>
        <div>
            <Button onClick={handleShowWarn(0)} variant='outline-secondary' className='me-3'>
                Discard
            </Button>
            <Button onClick={handleDelete(warnProp)} variant='outline-primary'>
                Confirm Delete
            </Button>
        </div>
    </Modal.Footer>
    </Modal>
    </>
}

export default PropertyListCard;