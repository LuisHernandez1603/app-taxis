"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Car, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Using refs for uncontrolled inputs to avoid re-render issues
  const passengerEmailRef = useRef<HTMLInputElement>(null)
  const passengerPasswordRef = useRef<HTMLInputElement>(null)
  const driverEmailRef = useRef<HTMLInputElement>(null)
  const driverPasswordRef = useRef<HTMLInputElement>(null)
  const adminEmailRef = useRef<HTMLInputElement>(null)
  const adminPasswordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, userType: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    let emailValue = ""
    let passwordValue = ""
    
    if (userType === "passenger") {
      emailValue = passengerEmailRef.current?.value || ""
      passwordValue = passengerPasswordRef.current?.value || ""
    } else if (userType === "driver") {
      emailValue = driverEmailRef.current?.value || ""
      passwordValue = driverPasswordRef.current?.value || ""
    } else if (userType === "admin") {
      emailValue = adminEmailRef.current?.value || ""
      passwordValue = adminPasswordRef.current?.value || ""
    }
    
    try {
      const { error: signInError } = await signIn(emailValue, passwordValue)
      
      if (signInError) {
        setError(signInError.message === "Invalid login credentials" 
          ? "Credenciales invalidas. Verifica tu correo y contrasena."
          : signInError.message)
        setIsLoading(false)
        return
      }
      
      // Save user info to localStorage for guest compatibility
      localStorage.setItem("userEmail", emailValue)
      localStorage.setItem("userName", emailValue.split("@")[0])
      
      // Redirect based on user type
      if (userType === "passenger") {
        router.push("/")
      } else if (userType === "driver") {
        router.push("/driver")
      } else if (userType === "admin") {
        router.push("/admin")
      }
    } catch (err) {
      setError("Error al iniciar sesion. Intenta de nuevo.")
    }
    
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    // TODO: Implement Google OAuth with Supabase
    setError("Login con Google proximamente disponible")
    setIsLoading(false)
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    // TODO: Implement Facebook OAuth with Supabase
    setError("Login con Facebook proximamente disponible")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a5276] via-[#2874a6] to-[#1a5276] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
              <Car className="w-9 h-9 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">PACIFIC COAST TAXI</span>
          </Link>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1a5276]">Bienvenido</CardTitle>
            <CardDescription>
              Selecciona tu tipo de cuenta para iniciar sesion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="passenger" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="passenger" className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Pasajero</span>
                </TabsTrigger>
                <TabsTrigger value="driver" className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span className="hidden sm:inline">Conductor</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1">
                  <Shield className="w-4 h-4"/>
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="passenger">
                <form onSubmit={(e) => handleSubmit(e, "passenger")} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email-passenger">Correo Electronico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        ref={passengerEmailRef}
                        id="email-passenger"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-passenger">Contrasena</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        ref={passengerPasswordRef}
                        id="password-passenger"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent pl-10 pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="remember" className="rounded border-gray-300" />
                      <span className="text-sm text-gray-600">Recordarme</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[#1a5276] hover:underline">
                      Olvidaste tu contrasena?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#1a5276] hover:bg-[#154360] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesion..." : "Iniciar Sesion"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="driver">
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800 font-medium mb-2">Conductores Demo Disponibles:</p>
                    <p className="text-xs text-amber-600 mb-3">Selecciona un conductor para acceder al panel</p>
                    <div className="space-y-2">
                      {[
                        { email: "jcmendez@pacificcoast.taxi", name: "Juan Carlos Mendez", vehicle: "Toyota Corolla" },
                        { email: "merodriguez@pacificcoast.taxi", name: "Maria Elena Rodriguez", vehicle: "Honda Civic" },
                        { email: "rgonzalez@pacificcoast.taxi", name: "Roberto Gonzalez", vehicle: "Nissan Sentra" },
                        { email: "aplopez@pacificcoast.taxi", name: "Ana Patricia Lopez", vehicle: "Hyundai Accent" },
                        { email: "camartinez@pacificcoast.taxi", name: "Carlos Alberto Martinez", vehicle: "Kia Rio" },
                      ].map((driver) => (
                        <button
                          key={driver.email}
                          type="button"
                          onClick={() => {
                            localStorage.setItem("driverEmail", driver.email)
                            localStorage.setItem("driverName", driver.name)
                            router.push("/driver")
                          }}
                          className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all"
                        >
                          <p className="font-medium text-[#1a5276]">{driver.name}</p>
                          <p className="text-xs text-gray-500">{driver.email} - {driver.vehicle}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">Acceso de Administrador</p>
                    <p className="text-xs text-blue-600 mb-3">Panel de control para gestionar el sistema</p>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem("adminEmail", "admin@pacificcoast.taxi")
                        localStorage.setItem("adminName", "Administrador")
                        router.push("/admin")
                      }}
                      className="w-full p-3 rounded-lg border border-blue-300 hover:border-blue-500 hover:bg-blue-100 transition-all"
                    >
                      <p className="font-medium text-[#1a5276]">Administrador Principal</p>
                      <p className="text-xs text-gray-500">admin@pacificcoast.taxi</p>
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continua con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading} type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full" onClick={handleFacebookLogin} disabled={isLoading} type="button">
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              No tienes una cuenta?{" "}
              <Link href="/register" className="text-[#1a5276] font-semibold hover:underline">
                Registrate aqui
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          <Link href="/" className="hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
