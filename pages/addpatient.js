import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default function AddPatient() {

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

    // If there is no primary address, default to the first in the list
    useEffect(() => {
        if(addresses.filter(e => e.primary).length === 0)
            setPrimaryAddress(0);
    },[addresses])

    const addPatient =async ()=> {
        
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
        <form onSubmit={e => {
            e.preventDefault();
            addPatient();
        }}>
            <input placeholder='First Name' onChange={e => setFirst(e.target.value)}/>
            <input placeholder='Middle Name' onChange={e => setMiddle(e.target.value)}/>
            <input placeholder='Last Name' onChange={e => setLast(e.target.value)}/>

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

            <button type='submit'>Create Patient</button>
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