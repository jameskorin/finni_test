import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

export default function Login() {
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const login =async ()=> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if(error === null)
            router.push('/patients');
        else
            setErrorMessage(error.toString().substring('AuthAPIError: '.length));
    }

    return <div>
        <div>Log In</div>
        <form onSubmit={e => {
            e.preventDefault();
            login();
        }}>
            <input placeholder='Email' onChange={e => setEmail(e.target.value)} type='email'/>
            <input placeholder='Password' onChange={e => setPassword(e.target.value)} type='password'/>
            <button type='submit'>Submit</button>
        </form>
        <div>{errorMessage}</div>
        <div>Don't have an account? <a href='/signup'>Sign up.</a></div>
    </div>
}