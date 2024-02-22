 
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseInit } from './api';
 

export default function Callback() {
  const router = useRouter();
  const supabase = useSupabaseInit();  
  useEffect(() => {
    // Function to process the callback URL
    const processAuth = async () => {
      
      const { access_token, expires_in, refresh_token, token_type } = router.query;

      if (!access_token) {
        // Handle the error, redirect to login page or show an error message
        console.log("No access token found in URL");
        router.push('/register');
        return;
      }

      const { data, error } = supabase.auth.setSession({
        access_token,
        refresh_token
      })
      // Set the session data in Supabase and in local storage
       
      localStorage.setItem('supabase.auth.token', JSON.stringify({ access_token, expires_in, refresh_token, token_type }));

      // Redirect to the desired page after successful login
      router.push('/home');
    };

    if (router.isReady) {
      processAuth();
    }
  }, [router, supabase.auth]);

  return (
    <div>Loading...</div>
  );
}
