import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UI from '../ui/patients'

export default function Patients() {

    const [searching, setSearching] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        getPage();
    }, [page])
    
    // Wait until the user has stopped typing for a quarter second to reduce overlapping queries
    useEffect(() => { const delay = setTimeout(() => {
        if(page === 0)
            getPage();
            setPage(0);
        }, 250);
        return () => clearTimeout(delay)
    }, [search])
    
    const getPage =async ()=> {
        setSearching(true);
        const r = await axios.post('/api/getPatients', {
            search: search.trim(),
            page: page
        });
        setPatients(r.data.rows);
        setSearching(false);
        setFetched(true);
    }

    return <UI searching={searching}
    fetched={fetched}
    patients={patients}
    search={search}
    setSearch={setSearch}
    page={page}
    setPage={setPage}/>;
}