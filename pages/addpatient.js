import React, { useEffect, useState } from 'react'
import _ from 'lodash'

export default function AddPatient() {

    const [first, setFirst] = useState('');
    const [middle, setMiddle] = useState('');
    const [last, setLast] = useState('');
    const [addresses, setAddresses] = useState([{
        street: '',
        city: '',
        state: '',
        zip: '',
        primary: true
    }]);

    useEffect(() => {
        console.log(addresses);
    },[addresses])

    const addPatient =async ()=> {
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
                    <input placeholder='State' onChange={e => editAddress(index, 'state', e.target.value)} value={item.state}/>
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