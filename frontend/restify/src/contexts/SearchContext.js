import { createContext, useState } from "react";

export const SearchContext = createContext({
    search: "",
    setSearch: () => {},
    numGuest: 0,
    setNumGuest: () => {},
    amenity: "",
    setAmenity: () => {},
    ordering: "",
    setOrdering: () => {},
    maxPrice: 0,
    setMaxPrice: () => {},
});

export function useSearchContext() {
    const [search, setSearch] = useState([]);
    const [numGuest, setNumGuest] = useState(0);
    const [amenity, setAmenity] = useState("");
    const [ordering, setOrdering] = useState("");
    const [maxPrice, setMaxPrice] = useState(0);

    return {
        search, setSearch,
        numGuest, setNumGuest,
        amenity, setAmenity,
        ordering, setOrdering,
        maxPrice, setMaxPrice,
    };
}