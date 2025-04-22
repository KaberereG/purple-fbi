import React, {createContext, useContext, useState} from 'react';

const SearchContext = createContext();

export const SearchProvider=({children})=>{
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');

    return(
        <SearchContext.Provider value = {{query,setQuery,filter,setFilter}}>
            {children}
        </SearchContext.Provider>
    )
}

// Created a custom hook to easily access context values instead of using useContext(SearchContext)
export const useSearch = () => useContext(SearchContext);