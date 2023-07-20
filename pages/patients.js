import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default function Patients() {

    const [fetched, setFetched] = useState(false);
    const [uid, setUid] = useState('');
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUser();
    },[])

    useEffect(() => {
        if(uid !== '')
            getPatients();
    },[uid])

    const getUser =async ()=> {
        const { data: { user } } = await supabase.auth.getUser();
        setUid(user.id);
    }

    const getPatients =async ()=> {
        setPatients((await axios.get('/api/getPatients')).data.rows);
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
    </div>
}