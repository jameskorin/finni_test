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
        let promises = [
            supabase.from('patients')
            .select(`
                first_name,
                middle_name,
                last_name,
                date_of_birth,
                custom_data,
                id
            `).eq('id',id),
            supabase.from('addresses')
            .select()
            .eq('patient_id',id)
        ];
        const p = await Promise.all(promises);
        const patient = p[0].data[0];
        const addresses = p[1].data;
        setExistingRecord({...patient,addresses:addresses});
    }

    if(existingRecord === null) return null;
    return <AddPatient edit existingRecord={existingRecord}/>
}