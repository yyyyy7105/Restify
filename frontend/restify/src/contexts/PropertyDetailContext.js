import { createContext, useState } from "react";

export const PropertyDetailContext = createContext({
    prop: {
        // "id": 8,
        // "host_firstname": "Yi",
        // "host_lastname": "Yang",
        // "host_avatar": null,
        // "preview": [],
        // "name": "",
        // "country": "",
        // "province": "",
        // "city": "",
        // "apt_number": null,
        // "street_number": "",
        // "postal_code": "",
        // "email": "",
        // "phone_number": "",
        // "price": 1,
        // "rating": null,
        // "rating_num": 0,
        // "amenity": "",
        // "capacity": 0,
        // "host": 1,
    }, 
    setProp: () => {},  
});

export function usePropertyDetailContext() {
    const [prop, setProp] = useState({
        // "id": 0,
        // "host_firstname": "Yi",
        // "host_lastname": "Yang",
        // "host_avatar": null,
        // "preview": [],
        // "name": "",
        // "country": "",
        // "province": "",
        // "city": "",
        // "apt_number": null,
        // "street_number": "",
        // "postal_code": "",
        // "email": "",
        // "phone_number": "",
        // "price": 1,
        // "rating": null,
        // "rating_num": 0,
        // "amenity": "",
        // "capacity": 0,
        // "host": 0,
    });

    return {
        prop, setProp,
    };
}