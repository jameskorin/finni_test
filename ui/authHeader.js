import React, { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export default function AuthHeader() {
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const router = useRouter();

    useEffect(() => {
        getAuth();
    },[])

    const getAuth =async ()=> {
        const { data, error } = await supabase.auth.getSession();
        if(data.session === null)
            router.push('/login');
    }

    const logout =async ()=> {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return <Outer>
        <Button onClick={logout}>Log out</Button>
    </Outer>;
}

const Outer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const Button = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;