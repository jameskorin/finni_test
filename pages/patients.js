import React, { useEffect, useState } from 'react'

export default function Patients() {

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getPatients();
    },[])

    const getPatients =async ()=> {
        
    }

    return <div>
        <table>
            <tbody>
                {patients.map((item,index) => (
                    <tr>
                        <td>{item.last_name}</td>
                        <td>{item.first_name}</td>
                        <td>{item.middle_name}</td>
                        <td>{item.date_of_birth}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}