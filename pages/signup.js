import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

export default function Signup() {
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const signup =async ()=> {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if(error === null)
            router.push('/home');
        else
            setErrorMessage(error.toString().substring('AuthAPIError: '.length));
    }

    return <div>
        <div>Sign Up</div>
        <form onSubmit={e => {
            e.preventDefault();
            signup();
        }}>
            <input placeholder='Email' onChange={e => setEmail(e.target.value)} type='email'/>
            <input placeholder='Password' onChange={e => setPassword(e.target.value)} type='password'/>
            <button type='submit'>Submit</button>
        </form>
        <div>{errorMessage}</div>
        <div>Already have an account? <a href='/login'>Log in.</a></div>
    </div>
}