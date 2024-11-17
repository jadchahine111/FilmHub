import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  Loader
} from "lucide-react"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from "../hooks/AuthContext"

export default function GetStarted() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState("signup")
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  })

  const navigate = useNavigate()
  const { login, googleLogin } = useAuth()

  useEffect(() => {
    setEmail("")
    setPassword("")
    setName("")
    setErrors({})
    setIsFormValid(false)
    setTouched({
      name: false,
      email: false,
      password: false
    })
  }, [activeTab])

  useEffect(() => {
    validateForm()
  }, [name, email, password, activeTab])

  const validateEmail = email => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const validatePassword = password => {
    return password.length >= 8 && /[A-Z]/.test(password)
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (activeTab === "signup" && touched.name && !name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (touched.email && !validateEmail(email)) {
      newErrors.email = "Invalid email address"
      isValid = false
    }

    if (touched.password && !validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain at least 1 capital letter"
      isValid = false
    }

    setErrors(newErrors)
    setIsFormValid(isValid)
  }

  const handleBlur = field => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      await googleLogin(credentialResponse.credential)
      navigate('/movies')
    } catch (error) {
      console.error('Google login error:', error)
      setErrors({
        ...errors,
        api: 'Failed to login with Google. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = (error) => {
    console.error("Google OAuth error:", error);
    setErrors({
      ...errors,
      api: 'Google login failed. Please try again.'
    });
  }

  const googleButton = (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="filled_black"
        size="large"
        width="100%"
        text="continue_with"
      />
    </GoogleOAuthProvider>
  )

  const handleSignUp = async e => {
    e.preventDefault()
    if (!isFormValid) return
    setLoading(true)

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password
        },
        { withCredentials: true }
      )

      if (response.status === 201) {
        navigate("/verify-email", { state: { email } })
      }
    } catch (error) {
      console.error("Error signing up", error.response?.data || error.message)
      setErrors({
        ...errors,
        api:
          error.response?.data?.message ||
          "Something went wrong, please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async e => {
    e.preventDefault()
    if (!isFormValid) return
    setLoading(true)

    try {
      await login(email, password)
      navigate("/movies")
    } catch (error) {
      console.error("Error logging in", error.response?.data || error.message)
      setErrors({
        ...errors,
        api:
          error.response?.data?.message ||
          "Invalid credentials. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate("/")
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <Button
        variant="ghost"
        className="self-start mb-4 text-white bg-transparent hover:bg-transparent hover:text-white"
        onClick={handleGoBack}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Get Started</CardTitle>
          <CardDescription className="text-center">
            Create an account or log in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleButton}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground mt-3">
                Or continue with
              </span>
            </div>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      required
                    />
                    {touched.name && errors.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={() => handleBlur("password")}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide" : "Show"} password
                        </span>
                      </Button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}
                  </div>
                  {errors.api && <p className="text-red-500">{errors.api}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <Loader className="animate-spin" /> : "Sign Up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-solid">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={() => handleBlur("password")}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide" : "Show"} password
                        </span>
                      </Button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}
                  </div>
                  {errors.api && <p className="text-red-500">{errors.api}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <Loader className="animate-spin" /> : "Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}