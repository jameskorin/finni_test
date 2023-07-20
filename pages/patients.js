import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

const page_length = 10;

export default function Patients() {

    const [fetched, setFetched] = useState(false);
    const [uid, setUid] = useState('');
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [atEnd, setAtEnd] = useState(false);

    useEffect(() => {
        getUser();
    },[])

    useEffect(() => {
        if(page === 0)
            getPatients();
        setPage(0);
    },[search])

    useEffect(() => {
        if(uid !== '')
            getPatients();
    },[uid, page])

    const getUser =async ()=> {
        const { data: { user } } = await supabase.auth.getUser();
        setUid(user.id);
    }

    const getPatients =async ()=> {
        setFetched(false);
        const p = (await axios.post('/api/getPatients',{ 
            page: page, 
            search: search.trim() 
        })).data.rows;
        setAtEnd(p.length < page_length);
        setPatients(p.length > 0 ? p : patients);
        setFetched(true);
    }

    return <div>
        
        {/* Fetching */}
        {!fetched &&
        <div>Fetching Patient Data...</div>}

        {/* No patient data */}
        {fetched && patients.length === 0 &&
        <div>
            No Patient Data
            <a href='/addpatient'>Add Patient Data</a>
        </div>}

        <input placeholder='🔍 Search' value={search} 
        onChange={e => setSearch(e.target.value)}/>

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
            <button disabled={!fetched || page <= 0} 
            onClick={() => setPage(page - 1)}>
                prev
            </button>
            <button disabled={fetched && atEnd || !fetched}
            onClick={() => setPage(page + 1)}>
                next
            </button>
        </div>
    </div>
}