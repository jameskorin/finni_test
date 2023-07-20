import AddPatient from "./addpatient"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default function Edit() {

    const [existingRecord, setExistingRecord] = useState(null);

    useEffect(() => {
        getExistingRecord();
    },[])

    const getExistingRecord =async ()=> {
        const id = window.location.search.substring('?id='.length);
        console.log(id);
        const r = await axios.post('/api/getPatient', {
            id: id
        });
        setExistingRecord(r.data.rows[0]);
    }

    if(existingRecord === null) return null;
    return <AddPatient edit existingRecord={existingRecord}/>
}