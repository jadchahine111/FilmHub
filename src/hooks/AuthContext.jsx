import React, { createContext, useState, useContext, useCallback } from "react"
import axios from "axios"

const AuthContext = createContext(null)


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [bearerToken, setBearerToken] = useState(null)

  const checkAuth = useCallback(async () => {
    try {
      await axios.get("/api/auth/check", { withCredentials: true })
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      setBearerToken(null)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      )
      setIsAuthenticated(true)
      setBearerToken(response.data.token) // Assuming the server returns the bearer token
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post("/api/auth/signout", {}, { withCredentials: true })
      setIsAuthenticated(false)
      setBearerToken(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const googleLogin = async (googleToken) => {
    try {
      const response = await axios.post(
        "/api/auth/callback", // Your backend endpoint for Google login
        { token: googleToken },
        { withCredentials: true }
      )
      setIsAuthenticated(true)
      setBearerToken(response.data.token)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, bearerToken, login, logout, checkAuth, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
