import AddPatient from "./addpatient"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import axios from 'axios'
import PatientNotFound from '@/ui/patientNotFound'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default function Edit() {

    const [existingRecord, setExistingRecord] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        getExistingRecord();
    },[])

    const getExistingRecord =async ()=> {
        const id = window.location.search.substring('?id='.length);

        const { data, error } = await supabase.auth.getSession();
        const config = {
            headers: { Authorization: `Bearer ${data.session.access_token}` }
        };
        const r = await axios.post('/api/getPatient', {
            id: id
        }, config);
        if(r.data.rows.length > 0)
            setExistingRecord(r.data.rows[0]);
        else
            setError(true);
    }
    if(error) return <PatientNotFound/>;
    if(existingRecord === null) return null;
    return <AddPatient edit existingRecord={existingRecord}/>
}