import React from 'react'
import {
    Outer,
    Header,
    SearchInput,
    Message,
    Table,
    Nav,
    TopRow
} from '../styled-components/patients'
const page_length = 10;
export default function UI({
    searching,
    fetched,
    patients,
    search,
    setSearch,
    page,
    setPage
}) {
    return <Outer>

        <Header>Patients</Header>

        {/* Search bar and actions row */}
        <TopRow>
            {/* Search bar */}
            <SearchInput placeholder='🔍 Search' value={search} 
            onChange={e => setSearch(e.target.value)}/>

            {/* Link to /addpatient */}
            <a href='/addpatient'>Add patient</a>
        </TopRow>

        {/* Searching */}
        {searching &&
        <Message>Fetching Patient Data...</Message>}

        {/* No patient data */}
        {!searching && fetched && patients.length === 0 &&
        <Message>
            No Patient Data
            <a href='/addpatient'>Add Patient Data</a>
        </Message>}

        {/* Table of patient data */}
        <Table>
            <thead>
                <tr>
                    <th>First</th>
                    <th>Middle</th>
                    <th>Last</th>
                    <th>DoB</th>
                    <th>Street</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zip</th>
                </tr>
            </thead>
            <tbody>
                {patients.map((item,index) => (
                    <tr key={`${item.last_name}_${index}`}>
                        <td>{item.first_name}</td>
                        <td>{item.middle_name}</td>
                        <td>{item.last_name}</td>
                        <td>{item.date_of_birth.split("T")[0]}</td>
                        <td>{item.street}</td>
                        <td>{item.city}</td>
                        <td>{item.state}</td>
                        <td>{item.zip}</td>
                        <td><a href={`/edit?id=${item.id}`}>Edit</a></td>
                    </tr>
                ))}
            </tbody>
        </Table>

        <Nav>
            <button disabled={searching || page <= 0} 
            onClick={() => setPage(page - 1)}>
                prev
            </button>
            <button disabled={patients.length < page_length || searching}
            onClick={() => setPage(page + 1)}>
                next
            </button>
        </Nav>
    </Outer>
}