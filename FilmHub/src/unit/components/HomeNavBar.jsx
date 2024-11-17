import React from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext" // Import the useAuth hook
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon, LogOutIcon, MenuIcon, MountainIcon } from 'lucide-react'

export default function NavBar() {

  const navigate = useNavigate()
  const { logout } = useAuth() // Access the logout function from AuthContext

  const handleSignOut = async () => {
    try {
      await logout() // Call the logout function
      navigate("/get-started") // Redirect to login page after logout
    } catch (error) {
      console.error("Sign-out failed:", error)
    }
  }
  


  return (
    <header className="flex h-20 w-full items-center px-4 md:px-6 sticky top-0 z-10 shadow-md">
      {/* Mobile Nav */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-4 py-6"> {/* Increased gap between links */}
            <Link to="/movies" className="flex w-full items-center py-2 text-lg font-semibold">Search</Link>
            <Link to="/now-playing" className="flex w-full items-center py-2 text-lg font-semibold">Now Playing</Link>
            <Link to="/top-charts" className="flex w-full items-center py-2 text-lg font-semibold">Top Charts</Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <Link to="/" className="mr-6 hidden lg:flex items-center">
        <div className=" p-2 rounded-full mr-2">
          <MountainIcon className="h-6 w-6 text-primary-foreground" />
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex flex-grow justify-center items-center">
        <div className="flex gap-8"> {/* Increased gap between nav links */}
          <Link to="/movies " className="text-sm font-medium text-white">Search</Link>
          <Link to="/now-playing" className="text-sm font-medium text-white">Now Playing</Link>
          <Link to="/top-charts" className="text-sm font-medium text-white">Top Charts</Link>
        </div>
      </nav>

      {/* Profile Menu */}
      <div className="ml-auto">
      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white text-black hover:bg-white hover:text-black"
    >
      <UserIcon className="h-5 w-5 text-black" />
      <span className="sr-only">Open profile menu</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    align="end"
    className="w-56 bg-white border border-gray-200 shadow-lg"
  >
    <DropdownMenuItem>
      <Link to="/profile" className="flex w-full items-center text-black">
        <UserIcon className="mr-2 h-4 w-4 text-black" />
        Account
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <button className="flex w-full items-center text-destructive text-black" onClick={handleSignOut} >
        <LogOutIcon className="mr-2 h-4 w-4 text-black" />
        Sign Out
      </button>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      </div>
    </header>
  )
}
