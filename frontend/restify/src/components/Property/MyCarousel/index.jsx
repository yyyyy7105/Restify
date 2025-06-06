import { useContext } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import { PropertyDetailContext } from '../../../contexts/PropertyDetailContext';
import './style.css';

function MyCarousel() {
    const { prop } = useContext(PropertyDetailContext);
    return <Carousel variant="dark" className="mb-5">
        {
            prop.preview.map(preview => (
                <Carousel.Item key={preview.id}>
                    <div className="carousel-img">
                        <Link to={`${process.env.REACT_APP_API_URL}` + preview.image}>
                        <img
                            className="d-block w-100"
                            src={`${process.env.REACT_APP_API_URL}` + preview.image}
                            alt=""
                        />
                        </Link>
                    </div>
                </Carousel.Item>
            ))
        } 
    </Carousel>;
}

export default MyCarousel;