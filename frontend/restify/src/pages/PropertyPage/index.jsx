import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import MyCarousel from '../../components/Property/MyCarousel';
import PropertyDetail from '../../components/Property/PropertyDetail';
import { APIContext, useAPIContext } from '../../contexts/APIContext';
import { PropertyDetailContext } from '../../contexts/PropertyDetailContext';

function PropertyPage() {
    const { prop_id } = useParams();
    const { prop, setProp } = useContext(PropertyDetailContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/property/${prop_id}/detail/`)
        .then(response => response.json())
        .then(json => {
            setProp(json);
            setIsLoading(false);
        }) 
    }, [prop_id]);

    // console.log(prop);

    return <>
        <APIContext.Provider value={useAPIContext()}>
            { isLoading 
                ? <p>Loading...</p>
                : <>
                    <MyCarousel />
                    <PropertyDetail />
                </>
            }
        </APIContext.Provider>
    </>;
}

export default PropertyPage;