import React, { useState } from 'react'

export default function AddPatient() {

    const [first, setFirst] = useState('');
    const [middle, setMiddle] = useState('');
    const [last, setLast] = useState('');

    const addPatient =async ()=> {
        console.log('here');
    }

    return <div>
        <form onSubmit={e => {
            e.preventDefault();
            addPatient();
        }}>
            <input placeholder='First Name' onChange={e => setFirst(e.target.value)}/>
            <input placeholder='Middle Name' onChange={e => setMiddle(e.target.value)}/>
            <input placeholder='Last Name' onChange={e => setLast(e.target.value)}/>
            <button type='submit'>Create Patient</button>
        </form>
    </div>
}