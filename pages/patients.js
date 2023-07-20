import React, { useEffect, useState } from 'react'
import axios from 'axios'

const page_length = 10;

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

    return <div>
        {/* Search bar */}
        <input placeholder='🔍 Search' value={search} 
        onChange={e => setSearch(e.target.value)}/>

        {/* Searching */}
        {searching &&
        <div>Fetching Patient Data...</div>}

        {/* No patient data */}
        {!searching && fetched && patients.length === 0 &&
        <div>
            No Patient Data
            <a href='/addpatient'>Add Patient Data</a>
        </div>}

        {/* Table of patient data */}
        <table>
            <tbody>
                {patients.map((item,index) => (
                    <tr key={`${item.last_name}_${index}`}>
                        <td>{item.last_name}</td>
                        <td>{item.first_name}</td>
                        <td>{item.middle_name}</td>
                        <td>{item.date_of_birth.split("T")[0]}</td>
                        <td>{item.street}</td>
                        <td>{item.city}</td>
                        <td>{item.state}</td>
                        <td>{item.zip}</td>
                        <td><a href={`/edit?id=${item.id}`}>Edit</a></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div>
            <button disabled={searching || page <= 0} 
            onClick={() => setPage(page - 1)}>
                prev
            </button>
            <button disabled={patients.length < page_length || searching}
            onClick={() => setPage(page + 1)}>
                next
            </button>
        </div>
    </div>
}