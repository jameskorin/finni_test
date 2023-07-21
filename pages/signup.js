import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { Outer, Header, Form, Input, Button, Message } from '../styled-components/logInSignUp'

export default function Signup() {
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        getAuth();
    },[])

    const getAuth =async ()=> {
        const { data, error } = await supabase.auth.getSession();
        if(data.session !== null)
            router.push('/patients');
    }

    const signup =async ()=> {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if(error === null)
            router.push('/patients');
        else
            setErrorMessage(error.toString().substring('AuthAPIError: '.length));
    }

    return <Outer>
        <Header>Sign Up</Header>
        <Form onSubmit={e => {
            e.preventDefault();
            signup();
        }}>
            <Input placeholder='Email' onChange={e => setEmail(e.target.value)} type='email'/>
            <Input placeholder='Password' onChange={e => setPassword(e.target.value)} type='password'/>
            <Button type='submit'>Submit</Button>
        </Form>
        <Message>{errorMessage}</Message>
        <Message>Already have an account? <a href='/login'>Log in.</a></Message>
    </Outer>
}