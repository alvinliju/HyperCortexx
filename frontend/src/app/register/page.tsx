"use client"
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginState, setLoginState] = useState(false)
  const [error, setError] = useState("")


  useEffect(()=>{
    if(localStorage.getItem('token')){
      setLoginState(true)
    }
  }, [])


  useEffect(()=>{
    if(loginState === true){
      redirect('/')
    }
  }, [loginState])

    const  handleBasicLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(email, password)
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      })
      try{
        const result = await response.json()

        if(!response.ok){
          console.error('Login failed');
          setError(result.message || 'Login failed. Please check your credentials.');
          return 
        }

        const setToken = await localStorage.setItem('token', result.token)
        setLoginState(true)
      }catch(err){
        console.log(err)
      }
    }

    const handleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
      };
  return (
    <>
    <div className="flex items-center justify-center w-full h-screen px-4">
      <Card className="max-w-md">
        <CardHeader className="">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your gmail or use your google account to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e)=> handleBasicLogin(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
            <Label >Email</Label>
            <Input name="email" value={email} onChange={(e)=> setEmail(e.target.value)} type="text" placeholder="hello@hello.com"></Input>
            </div>
            <div className="flex flex-col gap-2">
            <Label className="">Name</Label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} name="name" type="text" placeholder="John doe"></Input>
            </div>
            <div className="flex flex-col gap-2">
            <Label className="">Password</Label>
            <Input value={password} onChange={(e)=>setPassword(e.target.value)} name="password" type="text" placeholder="Password"></Input>
            </div>
            {error && <p className="text-gray-500">{error}</p>}
            <Button type="submit" className="w-full">Submit</Button>
            
          </form>
        </CardContent>
        <CardFooter>
        <Button onClick={handleLogin}  className="w-full"> <FaGoogle/> </Button>
        </CardFooter>
      </Card>

        
    </div>
    </>
  )
}

export default Login