import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import UI from '../ui/addpatient'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default function AddPatient({
    edit,
    existingRecord
}) {

    const [first, setFirst] = useState('');
    const [middle, setMiddle] = useState('');
    const [last, setLast] = useState('');
    const [dob, setDob] = useState('');
    const [addresses, setAddresses] = useState([{
        street: '',
        city: '',
        state: '',
        zip: '',
        primary: true
    }]);
    const [arbitraries, setArbitraries] = useState([{"":""}]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // If editing an existing record, populate with that data
    useEffect(() => {
        if(edit) {
            const r = existingRecord;
            console.log(r);
            setFirst(r.first_name);
            setMiddle(r.middle_name);
            setLast(r.last_name);
            setDob(r.date_of_birth.split("T")[0]);
            setAddresses(r.addresses.sort((a,b) => a.primary ? -1:1));
            const keys = Object.keys(existingRecord.custom_data);
            const values = Object.values(existingRecord.custom_data);
            let pairs = [];
            for(let i = 0; i < keys.length; ++i)
                pairs.push({[keys[i]]:values[i]});
            setArbitraries(pairs);
        }
    },[])

    // If there is no primary address, default to the first in the list
    useEffect(() => {
        if(addresses.filter(e => e.primary).length === 0)
            setPrimaryAddress(0);
    },[addresses])

    useEffect(() => {
        console.log(arbitraries);
        console.log(ArrayToObj(arbitraries));
    },[arbitraries])

    const addPatient =async ()=> {

        if(submitting) return null;
        setSubmitting(true);
        
        // Check if form is submittable and return errors for incomplete data
        let err = '';
        if(addresses.filter(e => e.street.trim() === '' || e.city.trim() === '' || e.state === '' || e.zip.trim() === '').length > 0)
            err = 'Do not leave any fields blank on addresses';
        if(dob === '')
            err = 'Please enter a valid date of birth';
        if(first.trim() === '' || last.trim() === '')
            err = 'Please enter full name.';
        if(err !== '') {
            setError(err);
            return null;
        };

        // Add row to the patients table
        const { data, error } = await supabase
        .from('patients')
        .insert({ 
            first_name: first.trim(),
            middle_name: middle.trim(),
            last_name: last.trim(),
            date_of_birth: dob.trim(),
            custom_data: ArrayToObj(arbitraries)
        }).select();

        // Get id of the new row
        const patient_id = data[0].id;

        // Create new rows for each address referring to patient
        let promises = [];
        for(let i = 0; i < addresses.length; ++i)
            promises.push(supabase.from('addresses').insert({...addresses[i], patient_id: patient_id}));
        await Promise.all(promises);

        // Go to patients table
        router.push('/patients');
        setSubmitting(false);
    }

    const saveChanges =async ()=> {
        if(submitting) return null;
        setSubmitting(true);
        
        // Check if form is submittable and return errors for incomplete data
        let err = '';
        if(addresses.filter(e => e.street.trim() === '' || e.city.trim() === '' || e.state === '' || e.zip.trim() === '').length > 0)
            err = 'Do not leave any fields blank on addresses';
        if(dob === '')
            err = 'Please enter a valid date of birth';
        if(first.trim() === '' || last.trim() === '')
            err = 'Please enter full name.';
        if(err !== '') {
            setError(err);
            return null;
        };

        const patient_id = existingRecord.id;

        // Update row on the patients table
        const { data, error } = await supabase
        .from('patients')
        .update({ 
            first_name: first.trim(),
            middle_name: middle.trim(),
            last_name: last.trim(),
            date_of_birth: dob.trim(),
            custom_data: ArrayToObj(arbitraries)
        }).eq('id',patient_id);

        // Update existing addressses
        let promises = [];
        const existing_addresses = addresses.filter(e => existingRecord.addresses.find(a => a.id === e.id) !== undefined);
        for(let i = 0; i < existing_addresses.length; ++i)
            promises.push(supabase.from('addresses').update(existing_addresses[i]).eq('id',existing_addresses[i].id));

        // Create new rows for each new address
        const new_addresses = addresses.filter(e => existingRecord.addresses.find(a => a.id === e.id) === undefined);
        for(let i = 0; i < new_addresses.length; ++i)
            promises.push(supabase.from('addresses').insert({...new_addresses[i], patient_id: patient_id}));

        // Delete addresses that have been removed
        const deleted_addresses = existingRecord.addresses.filter(e => addresses.find(a => a.id === e.id) === undefined);
        for(let i = 0; i < deleted_addresses.length; ++i)
            promises.push(supabase.from('addresses').delete().eq('id',deleted_addresses[i].id));
        
        const r = await Promise.all(promises);

        // Go to patients table
        router.push('/patients');
        setSubmitting(false);
    }

    const addAddress =()=> {
        let c = _.cloneDeep(addresses);
        c.push({
            street: '',
            city: '',
            state: '',
            zip: '',
            primary: false
        })
        setAddresses(c);
    }

    const removeAddress =(index)=> {
        let c = _.clone(addresses);
        c.splice(index,1);
        setAddresses(c);
    }

    const editAddress =(index, field, value)=> {
        let c = _.cloneDeep(addresses);
        c[index][field] = value;
        setAddresses(c);
    }

    const setPrimaryAddress =(index)=> {
        let c = _.cloneDeep(addresses);
        for(let i = 0; i < c.length; ++i)
            c[i].primary = i === index;
        setAddresses(c);
    }

    const addArbitrary =()=> {
        let c = _.cloneDeep(arbitraries);
        c.push({"":""});
        setArbitraries(c);
    }
    const removeArbitrary =(index)=> {
        let c = _.cloneDeep(arbitraries);
        c.splice(index,1);
        setArbitraries(c);
    }
    const editArbitrary =(index, field, value)=> {
        let c = _.cloneDeep(arbitraries);
        c[index] = { [field]: value };
        setArbitraries(c);
    }

    const state = {
        first, setFirst,
        middle, setMiddle,
        last, setLast,
        dob, setDob,
        addresses,
        arbitraries,
        error,
        submitting,
        addPatient,
        saveChanges,
        addAddress,
        removeAddress,
        editAddress,
        addArbitrary,
        removeArbitrary,
        editArbitrary,
        edit
    };

    return <UI state={state}/>;
}

function ArrayToObj(obj) {
    const res = {};
    for(let i = 0; i < obj.length; ++i) {
        const key = Object.keys(obj[i])[0];
        const value = Object.values(obj[i])[0];
        Object.assign(res,{[key]:value});
    }
    return res;
}