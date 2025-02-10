import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom" 
import { axiosInstance } from "@/config/axios"
import { toast } from "sonner"



// schema for zod validation
const signUpSchema = z.object({
  username: z.string()
      .min(3, { message: "Username must be at least 3 characters" })
      .nonempty({ message: "Username is required" })
      .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores"),
  password: z.string()
      .min(4, {message:"Password must be at least 4 characters long"})
      .max(12, {message:"Password must be at most 12 characters long"})
      .nonempty("Password is required"),
})

export default function Login() {
  const [darkMode, setDarkMode] = useState(false)


   // Initializing react hook form with zod resolver
      const {
          register,
          handleSubmit,
          formState: { errors },
      } = useForm({
          resolver: zodResolver(signUpSchema),
      })




  useEffect(() => {
    
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const submitHandler = async (data) => {
    try {
          const res = await axiosInstance.post("/user/sign-in", data, {
            headers: {
              'Content-Type': 'application/json'
            }
        })
        if(res.data.success){
          // console.log(res.data);
          toast.success("welcome "+res.data.message.user.username);
        }  
    }catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
   
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors duration-200">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={toggleDarkMode}>
        {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Vistagram
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="sr-only">
                Username 
              </Label>
              <Input
                placeholder="Username "
               {...register("username")}
                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                
                type="password"
                placeholder="Password"
               {...register("password")}
                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/signup" className="text-sm text-pink-500 hover:text-purple-500 transition-colors duration-200">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
      <Card className="w-full max-w-md mt-4 bg-white dark:bg-gray-800 shadow-lg">
        <CardContent className="text-center py-4">
          <p className="dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/user/signup"
              className="text-pink-500 hover:text-purple-500 font-semibold transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

