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
        .max(20, { message: "Username must be at most 20 characters" })
        .nonempty({ message: "Username is required" })
        .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores"),
    email: z.string()
        .email({message:"Invalid email format"})
        .nonempty("Email is required"),
    password: z.string()
        .min(4, {message:"Password must be at least 4 characters long"})
        .max(12, {message:"Password must be at most 12 characters long"})
        .nonempty("Password is required"),
    profileImg: z.any().optional(), // Allow file upload
})

export default function Signup() {
    const [darkMode, setDarkMode] = useState(false)
  
    // Initializing react hook form with zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(signUpSchema),
    })

    // Handling dark and light mode
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

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    // Handling Image Upload
    const onFileChange = (e) => {
        setValue("profileImg", e.target.files[0])
    }

    const submitHandler = async (data) => {
        try {
            const formData = new FormData()
            formData.append("username", data.username)
            formData.append("email", data.email)
            formData.append("password", data.password)
            if (data.profileImg) {
                formData.append("profileImg", data.profileImg)
            }

            const res = await axiosInstance.post("/user/sign-up", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }) 
            if(res.data.success){
                toast.success("welcome "+res.data.message.username);
            }
        } catch (error) {
            console.log(error);
            
            toast.error(error.response.data.data)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors duration-200">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Toggle theme</span>
            </Button>
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <h1 className="text-4xl font-bold text-center mb-1 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                        Vistagram
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Sign up to see Photos & videos of your friends</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" encType="multipart/form-data">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-600 dark:text-gray-400">Email</Label>
                            <Input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-600 dark:text-gray-400">Username</Label>
                            <Input
                                placeholder="Username"
                                {...register("username")}
                                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-600 dark:text-gray-400">Password</Label>
                            <Input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Profile Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="profileImg" className="text-gray-600 dark:text-gray-400">Profile Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {watch("profileImg") && (
                                <img
                                    src={URL.createObjectURL(watch("profileImg"))}
                                    alt="Preview"
                                    className="mt-2 w-20 h-20 rounded-full object-cover"
                                />
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                        >
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
                    </p>
                </CardFooter>
            </Card>
            <Card className="w-full max-w-md mt-4 bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="text-center py-4">
                    <p className="dark:text-gray-300">
                        Already Have an account?{" "}
                        <Link
                            to="/user/login"
                            className="text-pink-500 hover:text-purple-500 font-semibold transition-colors duration-200"
                        >
                            Log in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
