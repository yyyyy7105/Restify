import { useContext } from 'react';
import { PropertyDetailContext } from '../../../contexts/PropertyDetailContext';


export function PropertyEditForm({ setShow }) {
    const { prop, setProp } = useContext(PropertyDetailContext);

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

        fetch(`http://127.0.0.1:8000/property/${prop.id}/update/`, {
            method: 'PUT', 
            headers: { 'Authorization': `Bearer ` + localStorage.getItem('access') },
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                setShow(false);
                const newData = {};

                // cannot ... spread formData, use a new dictionary
                formData.forEach((value, key) => newData[key] = value);
                setProp({...prop, ...newData});
                alert('The property has been updated!');
            } else {
                response.json()
                .then((error) => alert(JSON.stringify(error)));
            }
        })
        .catch(error => console.log(error.message));
    }

    return (
        <form id="edit-prop" name="update-prop" className="needs-validation" onSubmit={event => handleSubmit(event)}>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-name" name="edit-prop-name" placeholder="Heaven" defaultValue={prop.name} required />
                <label htmlFor="prop-name">Property Name</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-country" name="edit-prop-country" placeholder="Canada" defaultValue={prop.country} required />
                <label htmlFor="prop-country">Country</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-province" name="edit-prop-province" placeholder="Ontario" defaultValue={prop.province} required />
                <label htmlFor="prop-province">Province</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-city" name="edit-prop-city" placeholder="Toronto" defaultValue={prop.city} required />
                <label htmlFor="prop-city">City</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-apt-num" name="edit-prop-apt-num" placeholder="100 King Cir" defaultValue={prop.apt_number} />
                <label htmlFor="prop-apt-num">Apt Number</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-street-num" name="edit-prop-street-num" placeholder="100 King Cir" defaultValue={prop.street_number} required />
                <label htmlFor="prop-street-num">Street Number</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-postal-code" name="edit-prop-postal-code" placeholder="M5M 5M5" defaultValue={prop.postal_code} required />
                <label htmlFor="prop-postal-code">Postal Code</label>
            </div>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="host-email" name="edit-host-email"
                    placeholder="admin@restify.com" defaultValue={prop.email} required />
                <label htmlFor="host-email">Email</label>
            </div>
            <div className="form-floating mb-3">
                <input type="tel" className="form-control" id="host-tel" name="edit-host-tel" placeholder="111-111-1111" 
                    pattern="^\d{3}-\d{3}-\d{4}$" title="Please enter phone number in XXX-XXX-XXXX format, where X is a digit" defaultValue={prop.phone_number} required />
                <label htmlFor="host-tel">Phone Number</label>
            </div>
            <div className="form-floating mb-3">
                <input type="number" min="0" step="0.01" className="form-control" id="prop-price" name="edit-prop-price" placeholder="1"
                    defaultValue={prop.price} required />
                <label htmlFor="prop-price">Price</label>
            </div>
            <div className="form-floating mb-3">
                <input className="form-control" id="prop-amenity" name="edit-prop-amenity" placeholder="0" defaultValue={prop.amenity} />
                <label htmlFor="prop-amenity">Amenity</label>
            </div>
            <div className="form-floating mb-3">
                <input type="number" min="0" className="form-control" id="prop-capacity" name="edit-prop-capacity"
                    placeholder="1" defaultValue={prop.capacity} required />
                <label htmlFor="prop-capacity">Capacity</label>
            </div>
        </form>
    );
}

export default PropertyEditForm;