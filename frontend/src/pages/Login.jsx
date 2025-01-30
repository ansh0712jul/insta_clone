import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom" 

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [darkMode, setDarkMode] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempted with:", username, password)
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
            Instagram
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="sr-only">
                Username or Email
              </Label>
              <Input
                id="username"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              to="/user/logout"
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

