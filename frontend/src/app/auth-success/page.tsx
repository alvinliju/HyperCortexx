"use client"
import {redirect} from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
function page() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token');

    useEffect(()=>{
        if(token){
          localStorage.setItem('token', token)
            redirect('/')
        }

        redirect('/login')
    }, [token])
    
  return (
    <div>
        <h1>You'll be redirect soon..</h1>
    </div>
  )
}

export default page