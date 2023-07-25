import React from 'react'
import {
    Outer
} from '@/styled-components/patientNotFound'

export default function PatientNotFound() {
    return <Outer>
        <h1>We couldn't find that patient.</h1>
        <a href='/patients'>return to all patients</a>
    </Outer>;
}