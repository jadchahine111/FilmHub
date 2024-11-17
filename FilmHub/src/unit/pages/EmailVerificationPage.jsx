"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MailIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import axios from "axios"

export default function EmailVerificationPage({ setIsAuthenticated, setIsVerificationAllowed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ""

  const [timer, setTimer] = useState(60)
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    setIsVerificationAllowed(true)
    const checkVerificationStatus = async () => {
      try {
        const response = await axios.get(`/api/auth/check-verification/${email}`)
        const result = response.data

        if (response.status === 200 && result.isVerified) {
          setIsVerified(true)
          setIsAuthenticated(true)
          navigate("/movies")
        }
      } catch (error) {
        console.error("Error checking verification status:", error)
      }
    }

    if (!isVerified) {
      const interval = setInterval(checkVerificationStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [email, isVerified, navigate, setIsAuthenticated, setIsVerificationAllowed])

  useEffect(() => {
    let interval
    if (isVerifyDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsVerifyDisabled(false)
    }

    return () => clearInterval(interval)
  }, [isVerifyDisabled, timer])

  const handleVerifyEmail = async () => {
    setIsVerifyDisabled(true)
    setTimer(60)

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/check-verification/${email}`)
      
      if (response.status === 200) {
        console.log("API Response:", response);
        const result = response.data
        console.log("Parsed Result:", result); // Log the parsed result
        if (result.isVerified) {
          setIsVerified(true)
          setIsAuthenticated(true)
          navigate("/movies")
        } else {
          console.log("Email not yet verified:", result.message)
          // Optionally, show a message to the user that the email is not yet verified
        }
      } else {
        console.error("Unexpected response status:", response.status)
      }
    } catch (error) {
      console.error("Error verifying email:", error.response?.data?.message || error.message)
      // Optionally, show an error message to the user
    } finally {
      setIsVerifyDisabled(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            Click the button below to check your email verification status
          </CardDescription>
          <p className="text-center font-medium">{email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <MailIcon className="h-12 w-12 text-primary" />
          </div>
          <Button
            onClick={handleVerifyEmail}
            disabled={isVerifyDisabled}
            className="w-full"
          >
            {isVerifyDisabled ? `Check again in ${timer}s` : "Verify Email"}
          </Button>
          {isVerifyDisabled && (
            <div className="space-y-2">
              <Progress value={((60 - timer) / 60) * 100} />
              <p className="text-sm text-center text-muted-foreground">
                You can check again in {timer} seconds
              </p>
            </div>
          )}
          <p className="text-sm text-center text-muted-foreground mt-4">
            If you haven't received the verification email, please check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}