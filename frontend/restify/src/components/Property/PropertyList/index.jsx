import { useState, useEffect, useContext } from 'react';
import { SearchContext } from '../../../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import PropertyListCard from '../PropertyListCard';

import './style.css';


function PropertyList({ host }) {
    const navigate = useNavigate();
    const { search, numGuest, amenity, ordering, maxPrice } = useContext(SearchContext);

    const [props, setProps] = useState([]);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        count: 0,
        previous: null,
        next: null,
    })

    useEffect(() => {
        var query = `?search=${search}`;
        if (numGuest) query += `&num_guest=${numGuest}`;
        if (amenity) query += `&amenity=${amenity}`;
        if (ordering) query += `&ordering=${ordering}`;
        if (maxPrice) query += `&max_price=${maxPrice}`;
        query += `&page=${page}`;

        if (host.id) {
            fetch(`http://127.0.0.1:8000/property/user/${host.id}/` + query, {
                headers: { 'Authorization': `Bearer ` + localStorage.getItem('access') },
            })
            .then(response => response.json())
            .then(json => {
                // console.log(json);
                setProps(json.results);
                setMeta({
                    count: json.count,
                    previous: json.previous,
                    next: json.next,
                });
            });
        } else {
            fetch("http://127.0.0.1:8000/property/index/" + query)
            .then(response => response.json())
            .then(json => {
                // console.log(json);
                setProps(json.results);
                setMeta({
                    count: json.count,
                    previous: json.previous,
                    next: json.next,
                });
            });
        }

        
        
        if (host.id) {
            navigate(`/property/user/${host.id}/${query}`);
        } else {
            navigate(`/property/index/${query}`);
        }

    }, [search, numGuest, amenity, ordering, page, maxPrice, navigate]);

    return <>
    <p className="text-center text-secondary mt-3" id="num-results">{meta.count} results.</p>
    <div className="container">
      <div className="row">
        <PropertyListCard props={props} setProps={setProps} host={host} />
      </div>
    </div>
    <p className="text-center text-secondary mt-3">
    { meta.previous !== null
        ? <Button className="mx-1" variant="outline-primary" onClick={() => setPage(page - 1)}>Prev</Button>
        : <></>
    }
    { meta.next !== null
        ? <Button className="mx-1" variant="outline-primary" onClick={() => setPage(page + 1)}>Next</Button>
        : <></>
    }
    </p>
    </>;
}

export default PropertyList;