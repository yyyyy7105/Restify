// import { useState } from 'react';
// import { PropertyDetailContext } from '../../../contexts/PropertyDetailContext';
import { useNavigate } from 'react-router-dom';


export function PropertyCreateForm({ host, setShow }) {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        console.log(event);
        formData.append('name', event.target.elements['prop-name'].value);
        formData.append('country', event.target.elements['prop-country'].value);
        formData.append('province', event.target.elements['prop-province'].value);
        formData.append('city', event.target.elements['prop-city'].value);
        formData.append('apt_number', event.target.elements['prop-apt-num'].value);
        formData.append('street_number', event.target.elements['prop-street-num'].value);
        formData.append('postal_code', event.target.elements['prop-postal-code'].value);
        formData.append('email', event.target.elements['host-email'].value);
        formData.append('phone_number', event.target.elements['host-tel'].value);
        formData.append('price', event.target.elements['prop-price'].value);
        formData.append('amenity', event.target.elements['prop-amenity'].value);
        formData.append('capacity', event.target.elements['prop-capacity'].value);

        fetch(`http://127.0.0.1:8000/property/add/`, {
            method: 'POST', 
            headers: { 'Authorization': `Bearer ` + localStorage.getItem('access') },
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                setShow(false);
                response.json()
                .then((prop) => {
                    navigate(`/property/${prop.id}/detail`);
                });
                
            } else {
                response.json()
                .then((error) => alert(JSON.stringify(error)));
            }
        })
        .catch(error => console.log(error.message));
    }

    return (
        <form id="create-prop" name="create-prop" className="needs-validation" onSubmit={event => handleSubmit(event)}>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-name" name="create-prop-name" placeholder="Heaven" required />
                <label htmlFor="prop-name">Property Name</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-country" name="create-prop-country" placeholder="Canada" required />
                <label htmlFor="prop-country">Country</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-province" name="create-prop-province" placeholder="Ontario" required />
                <label htmlFor="prop-province">Province</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-city" name="create-prop-city" placeholder="Toronto" required />
                <label htmlFor="prop-city">City</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-apt-num" name="create-prop-apt-num" placeholder="100 King Cir" />
                <label htmlFor="prop-apt-num">Apt Number</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-street-num" name="create-prop-street-num" placeholder="100 King Cir" required />
                <label htmlFor="prop-street-num">Street Number</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-postal-code" name="create-prop-postal-code" placeholder="M5M 5M5" required />
                <label htmlFor="prop-postal-code">Postal Code</label>
            </div>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="host-email" name="create-host-email"
                    placeholder="admin@restify.com" defaultValue={host.email} required />
                <label htmlFor="host-email">Email</label>
            </div>
            <div className="form-floating mb-3">
                <input type="tel" className="form-control" id="host-tel" name="create-host-tel" placeholder="111-111-1111" 
                    pattern="^\d{3}-\d{3}-\d{4}$" title="Please enter phone number in XXX-XXX-XXXX format, where X is a digit" defaultValue={host.phone_number} required />
                <label htmlFor="host-tel">Phone Number</label>
            </div>
            <div className="form-floating mb-3">
                <input type="number" min="0" step="0.01" className="form-control" id="prop-price" name="create-prop-price" placeholder="1" required />
                <label htmlFor="prop-price">Price</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-amenity" name="create-prop-amenity" placeholder="0" />
                <label htmlFor="prop-amenity">Amenity</label>
            </div>
            <div className="form-floating mb-3">
                <input type="number" min="0" className="form-control" id="prop-capacity" name="create-prop-capacity"
                    placeholder="1" required />
                <label htmlFor="prop-capacity">Capacity</label>
            </div>
        </form>
    );
}

export default PropertyCreateForm;