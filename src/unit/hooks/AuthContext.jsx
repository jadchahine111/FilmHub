import React, { createContext, useState, useContext, useEffect } from "react"
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
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/check`,
          { withCredentials: true }
        )
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsAuthenticated(false)
    }
  }

  const googleLogin = async (googleToken) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/google/callback`, // Your backend endpoint for Google login
        { token: googleToken },
        { withCredentials: true }
      )
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  // Create an axios instance with interceptors
  const authAxios = axios.create()

  authAxios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        setIsAuthenticated(false) // Handle expired access token by setting user as unauthenticated
      }
      return Promise.reject(error)
    }
  )

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, googleLogin, authAxios }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext