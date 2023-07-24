import AuthHeader from '@/ui/authHeader'
import React from 'react'
import { states } from '../util/states'
import {
    Outer,
    Form,
    Input,
    SectionHeader,
    Select,
    AddButton,
    Section,
    Address,
    Addresses,
    RemoveButton,
    SaveButton
} from '@/styled-components/addpatient'

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
        setPrimaryAddress,
        addAddress,
        removeAddress,
        editAddress,
        addArbitrary,
        removeArbitrary,
        editArbitrary,
        edit
    } = state;
    return <Outer>
        <AuthHeader/>

        <a href='/patients'>👈 all patients</a>

        <Form disabled={submitting} onSubmit={e => {
            e.preventDefault();
            if(edit) {
                saveChanges();
            } else {
                addPatient();
            }
        }}>
            <SectionHeader>Patient Data</SectionHeader>
            <Input placeholder='First Name' onChange={e => setFirst(e.target.value)} value={first}/>
            <Input placeholder='Middle Name' onChange={e => setMiddle(e.target.value)} value={middle}/>
            <Input placeholder='Last Name' onChange={e => setLast(e.target.value)} value={last}/>
            <label for='dob-input'>Date of Birth</label>
            <Input id='dob-input' type='date' placeholder='Date of Birth' value={dob} onChange={e => setDob(e.target.value)}/>

            {/* Arbitraries */}
            <Section>
            <SectionHeader>Custom Data</SectionHeader>
            <Addresses>
            {arbitraries.map((item, index) => (
                <Address key={`arbitrary_${index}`}>
                    <Input placeholder='Field' onChange={e => editArbitrary(index, e.target.value, Object.values(item)[0])} value={Object.keys(item)[0]}/>
                    <Input placeholder='Value' onChange={e => editArbitrary(index, Object.keys(item)[0], e.target.value)} value={Object.values(item)[0]}/>
                    <RemoveButton onClick={e => {
                        e.preventDefault();
                        removeArbitrary(index)
                    }}>remove</RemoveButton>
                </Address>
            ))}
            </Addresses>
            <AddButton onClick={e => {
                e.preventDefault();
                addArbitrary();
            }}>+ New Field</AddButton>
            </Section>

            {/* Addresses */}
            <Section>
            <SectionHeader>Addresses</SectionHeader>
            <Addresses>
            {addresses.map((item, index) => (
                <Address key={`address_${index}`}>
                    <Input placeholder='Street' onChange={e => editAddress(index, 'street', e.target.value)} value={item.street}/>
                    <Input placeholder='City' onChange={e => editAddress(index, 'city', e.target.value)} value={item.city}/>
                    <Select placeholder='State' onChange={e => editAddress(index, 'state', e.target.value)} value={item.state}>
                        <option selected={item.state === ''} value='' disabled>State</option>
                        {states.map((item_state, index_state) => (
                            <option value={item_state} key={`${index}_${item_state}`}>{item_state}</option>
                        ))}
                    </Select>
                    <Input placeholder='Zip' onChange={e => editAddress(index, 'zip', e.target.value)} value={item.zip}/>
                    <Input type='radio' name='primary_address' id={`address_${index}`} onClick={e => setPrimaryAddress(index)} checked={item.primary}/>
                    <label for={`address_${index}`}>primary</label>
                    <RemoveButton disabled={addresses.length <= 1} onClick={e => {
                        e.preventDefault();
                        removeAddress(index)
                    }}>remove</RemoveButton>
                </Address>
            ))}
            </Addresses>
            <AddButton onClick={e => {
                e.preventDefault();
                addAddress();
            }}>+ New Address</AddButton>
            </Section>

            <SaveButton type='submit'>{edit ? 'Save Changes' : 'Create Patient'}</SaveButton>
        </Form>
        <div>{error}</div>
    </Outer>
}