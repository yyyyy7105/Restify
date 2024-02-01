import { SearchContext, useSearchContext } from '../../contexts/SearchContext';
import Search from '../../components/Property/Search';
import PropertyList from '../../components/Property/PropertyList';

function Home() {
    return <>
        <SearchContext.Provider value={useSearchContext()}>
            <Search host={{id: 0}}/>
            <PropertyList host={{id: 0}} />
        </SearchContext.Provider>
    </>;
}

export default Home;