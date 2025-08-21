"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push("/login")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">VITAL RED</h1>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  )
}
