// import { useState, useEffect } from 'react';
import Search from '../../../components/Search';
import PropertyList from '../../../components/PropertyList';
import { useSearchContext, SearchContext } from '../../contexts/SearchContext';

function Home() {
    return <>
    <SearchContext.Provider value={useSearchContext()}>
        <Search />
        <PropertyList />
    </SearchContext.Provider>
    </>;
}

export default Home;