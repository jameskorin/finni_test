import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
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
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // If editing an existing record, populate with that data
    useEffect(() => {
        if(edit) {
            const r = existingRecord;
            setFirst(r.first_name);
            setMiddle(r.middle_name);
            setLast(r.last_name);
            setDob(r.date_of_birth);
            setAddresses(r.addresses.sort((a,b) => a.primary ? -1:1));
        }
    },[])

    // If there is no primary address, default to the first in the list
    useEffect(() => {
        if(addresses.filter(e => e.primary).length === 0)
            setPrimaryAddress(0);
    },[addresses])

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
            date_of_birth: dob.trim()
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
            date_of_birth: dob.trim()
        }).eq('id',patient_id);

        // Update existing addressses
        let promises = [];
        const existing_addresses = addresses.filter(e => existingRecord.addresses.find(a => a.id === e.id) !== undefined);
        console.log(existing_addresses);
        for(let i = 0; i < existing_addresses.length; ++i)
            promises.push(supabase.from('addresses').update(existing_addresses[i]).eq('id',existing_addresses[i].id));

        // Create new rows for each new address
        const new_addresses = addresses.filter(e => existingRecord.addresses.find(a => a.id === e.id) === undefined);
        console.log(new_addresses);
        for(let i = 0; i < new_addresses.length; ++i)
            promises.push(supabase.from('addresses').insert({...new_addresses[i], patient_id: patient_id}));

        // Delete addresses that have been removed
        const deleted_addresses = existingRecord.addresses.filter(e => addresses.find(a => a.id === e.id) === undefined);
        console.log(deleted_addresses);
        for(let i = 0; i < deleted_addresses.length; ++i)
            promises.push(supabase.from('addresses').delete().eq('id',deleted_addresses[i].id));
        
        const r = await Promise.all(promises);
        console.log(r);

        // Go to patients table
        // router.push('/patients');
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

    return <div>
        <form disabled={submitting} onSubmit={e => {
            e.preventDefault();
            if(edit) {
                saveChanges();
            } else {
                addPatient();
            }
        }}>
            <input placeholder='First Name' onChange={e => setFirst(e.target.value)} value={first}/>
            <input placeholder='Middle Name' onChange={e => setMiddle(e.target.value)} value={middle}/>
            <input placeholder='Last Name' onChange={e => setLast(e.target.value)} value={last}/>

            <input type='date' placeholder='Date of Birth' value={dob} onChange={e => setDob(e.target.value)}/>

            {/* Addresses */}
            {addresses.map((item, index) => (
                <div key={`address_${index}`}>
                    <input placeholder='Street' onChange={e => editAddress(index, 'street', e.target.value)} value={item.street}/>
                    <input placeholder='City' onChange={e => editAddress(index, 'city', e.target.value)} value={item.city}/>
                    <select placeholder='State' onChange={e => editAddress(index, 'state', e.target.value)} value={item.state}>
                        <option selected={item.state === ''} value='' disabled>State</option>
                        {states.map((item_state, index_state) => (
                            <option value={item_state} key={`${index}_${item_state}`}>{item_state}</option>
                        ))}
                    </select>
                    <input placeholder='Zip' onChange={e => editAddress(index, 'zip', e.target.value)} value={item.zip}/>
                    <input type='radio' name='primary_address' onClick={e => setPrimaryAddress(index)} checked={item.primary}/>
                    <button disabled={addresses.length <= 1} onClick={e => {
                        e.preventDefault();
                        removeAddress(index)
                    }}>Remove Address</button>
                </div>
            ))}
            <button onClick={e => {
                e.preventDefault();
                addAddress();
            }}>New Address</button>

            <button type='submit'>{edit ? 'Save Changes' : 'Create Patient'}</button>
        </form>
        <div>{error}</div>
    </div>
}

const states = [
'Alabama',
'Alaska',
'Arizona',
'Arkansas',
'California',
'Colorado',
'Connecticut',
'Delaware',
'Florida',
'Georgia',
'Hawaii',
'Idaho',
'Illinois',
'Indiana',
'Iowa',
'Kansas',
'Kentucky',
'Louisiana',
'Maine',
'Maryland',
'Massachusetts',
'Michigan',
'Minnesota',
'Mississippi',
'Missouri',
'Montana',
'Nebraska',
'Nevada',
'New Hampshire',
'New Jersey',
'New Mexico',
'New York',
'North Carolina',
'North Dakota',
'Ohio',
'Oklahoma',
'Oregon',
'Pennsylvania',
'Rhode Island',
'South Carolina',
'South Dakota',
'Tennessee',
'Texas',
'Utah',
'Vermont',
'Virginia',
'Washington',
'West Virginia',
'Wisconsin',
'Wyoming',
];