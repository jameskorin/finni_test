import AuthHeader from '@/ui/authHeader'
import React from 'react'
import { states } from '../util/states'

export default function UI({
    state
}) {
    const {
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
    } = state;
    return <div>
        <AuthHeader/>

        <a href='/patients'>👈 all patients</a>

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

            {/* Arbitraries */}
            {arbitraries.map((item, index) => (
                <div key={`arbitrary_${index}`}>
                    <input placeholder='Field' onChange={e => editArbitrary(index, e.target.value, Object.values(item)[0])} value={Object.keys(item)[0]}/>
                    <input placeholder='Value' onChange={e => editArbitrary(index, Object.keys(item)[0], e.target.value)} value={Object.values(item)[0]}/>
                    <button onClick={e => {
                        e.preventDefault();
                        removeArbitrary(index)
                    }}>Remove Arbitrary</button>
                </div>
            ))}
            <button onClick={e => {
                e.preventDefault();
                addArbitrary();
            }}>Add Arbitrary</button>

            <button type='submit'>{edit ? 'Save Changes' : 'Create Patient'}</button>
        </form>
        <div>{error}</div>
    </div>
}