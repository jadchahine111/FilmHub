"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import axios from "axios"

export default function EmailVerificationPage({ setIsAuthenticated }) {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ""

  const [timer, setTimer] = useState(() => {
    const savedTimer = localStorage.getItem("verificationTimer")
    const savedTimerExpiration = localStorage.getItem("verificationTimerExpiration")

    if (savedTimer && savedTimerExpiration) {
      const remainingTime = Math.max(0, Math.floor((Number.parseInt(savedTimerExpiration) - Date.now()) / 1000))
      return remainingTime > 0 ? remainingTime : 0
    }
    return 0
  })
  const [isVerified, setIsVerified] = useState(false)

  const checkVerificationStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-verification/${email}`)
      const result = response.data

      if (response.status === 200 && result.isVerified) {
        setIsVerified(true)
        setIsAuthenticated(true)
        navigate("/movies")
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
    }
  }, [email, navigate, setIsAuthenticated])

  useEffect(() => {
    if (!isVerified) {
      const interval = setInterval(checkVerificationStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [isVerified, checkVerificationStatus])

  useEffect(() => {
    let interval
    if (timer > 0) {
      localStorage.setItem("verificationTimer", timer.toString())
      localStorage.setItem("verificationTimerExpiration", (Date.now() + timer * 1000).toString())

      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1
          if (newTimer <= 0) {
            localStorage.removeItem("verificationTimer")
            localStorage.removeItem("verificationTimerExpiration")
          }
          return newTimer
        })
      }, 1000)
    }

    return () => {
      clearInterval(interval)
      if (timer <= 0) {
        localStorage.removeItem("verificationTimer")
        localStorage.removeItem("verificationTimerExpiration")
      }
    }
  }, [timer])

  const handleVerifyEmail = async () => {
    if (timer > 0) return
    setTimer(60)

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-verification/${email}`)

      if (response.status === 200) {
        const result = response.data
        if (result.isVerified) {
          setIsVerified(true)
          setIsAuthenticated(true)
          navigate("/movies")
        } else {
          // Optionally, show a message to the user that the email is not yet verified
        }
      } else {
        console.error("Unexpected response status:", response.status)
      }
    } catch (error) {
      console.error("Error verifying email:", error.response?.data?.message || error.message)
      // Optionally, show an error message to the user
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            Click the button below to check your email verification status
          </CardDescription>
          <p className="text-center font-medium">{email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <MailIcon className="h-12 w-12 text-primary" />
          </div>
          <Button onClick={handleVerifyEmail} disabled={timer > 0} className="w-full">
            {timer > 0 ? `Check again in ${timer}s` : "Verify Email"}
          </Button>
          {timer > 0 && (
            <div className="space-y-2">
              <Progress value={((60 - timer) / 60) * 100} />
              <p className="text-sm text-center text-muted-foreground">You can check again in {timer} seconds</p>
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

