"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CookieIcon } from "lucide-react"

export default function CookiesPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    advertising: false
  })

  useEffect(() => {
    const hasSeenCookiePopup = localStorage.getItem("hasSeenCookiePopup")
    if (!hasSeenCookiePopup) {
      setIsOpen(true)
    }
  }, [])

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true
    })
    closeCookiePopup()
  }

  const handleSavePreferences = () => {
    closeCookiePopup()
  }

  const closeCookiePopup = () => {
    setIsOpen(false)
    localStorage.setItem("hasSeenCookiePopup", "true")
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences))
    // Here you would typically update your cookie settings based on user preferences
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CookieIcon className="mr-2 h-6 w-6" />
            Cookie Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showPreferences ? (
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, serve
              personalized ads or content, and analyze our traffic. By clicking
              "Accept All", you consent to our use of cookies.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="necessary">Necessary</Label>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function properly.
                  </p>
                </div>
                <Switch
                  id="necessary"
                  checked={preferences.necessary}
                  onCheckedChange={checked =>
                    setPreferences(prev => ({ ...prev, necessary: checked }))
                  }
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="functional">Functional</Label>
                  <p className="text-sm text-muted-foreground">
                    Enables enhanced functionality and personalization.
                  </p>
                </div>
                <Switch
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={checked =>
                    setPreferences(prev => ({ ...prev, functional: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Helps us understand how visitors interact with the website.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={checked =>
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="advertising">Advertising</Label>
                  <p className="text-sm text-muted-foreground">
                    Used to provide personalized advertisements.
                  </p>
                </div>
                <Switch
                  id="advertising"
                  checked={preferences.advertising}
                  onCheckedChange={checked =>
                    setPreferences(prev => ({ ...prev, advertising: checked }))
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!showPreferences ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
              >
                Manage Preferences
              </Button>
              <Button onClick={handleAcceptAll}>Accept All</Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
              >
                Back
              </Button>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
