"use client"
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export function useSupabaseInit() {
    const [supabase, setSupabase] = useState(null);
    const supabaseUrl = 'https://goqddappvxwzpdkuvysm.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

    useEffect(() => {
        const supabaseClient = createClient(supabaseUrl, supabaseKey);
        setSupabase(supabaseClient);

        console.log('Supabase client initialized');

        // Cleanup function if needed
        return () => {
            // Perform any cleanup actions
        };
    }, []);

    return supabase;
}
