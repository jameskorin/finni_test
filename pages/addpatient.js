import React, { useEffect, useState } from 'react'
import _ from 'lodash'

export default function AddPatient() {

    const [first, setFirst] = useState('');
    const [middle, setMiddle] = useState('');
    const [last, setLast] = useState('');
    const [dob, setDob] = useState(new Date());
    const [addresses, setAddresses] = useState([{
        street: '',
        city: '',
        state: '',
        zip: '',
        primary: true
    }]);

    const addPatient =async ()=> {
        // Check if form is submittable
            // first, middle, last names are not blank
            // dob valid (any date in the past, for now)
            // 


        // Add row to the patients table
        // Get id of the new row
        // Create new rows for each address referring to patient
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

            {/* Addresses */}
            {addresses.map((item, index) => (
                <div key={`address_${index}`}>
                    <input placeholder='Street' onChange={e => editAddress(index, 'street', e.target.value)} value={item.street}/>
                    <input placeholder='City' onChange={e => editAddress(index, 'city', e.target.value)} value={item.city}/>
                    <select defaultValue='' placeholder='State' onChange={e => editAddress(index, 'state', e.target.value)} value={item.state}>
                        <option selected={item.state === ''} value='' disabled>State</option>
                        {states.map((item_state, index_state) => (
                            <option value={item_state} key={`${index}_${item_state}`}>{item_state}</option>
                        ))}
                    </select>
                    <input placeholder='Zip' onChange={e => editAddress(index, 'zip', e.target.value)} value={item.zip}/>
                    <input type='radio' name='primary_address' onClick={e => setPrimaryAddress(index)} checked={item.primary}/>
                    <button onClick={() => removeAddress(index)}>Remove Address</button>
                </div>
            ))}
            <button onClick={addAddress}>New Address</button>


            <button type='submit'>Create Patient</button>
        </form>
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