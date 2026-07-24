import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, User, KeyRound, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Decorative / Brand Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-tr from-primary-950 via-primary-900 to-primary-800 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-500/10 blur-[80px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[80%] h-[80%] rounded-full bg-primary-400/10 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PGAS Solution</h1>
            <p className="text-xs text-primary-300">Member of PGN</p>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-md animate-fade-in">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-primary-300 uppercase bg-primary-800/40 rounded-full border border-primary-700/50">
            Internal Platform
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight mt-6 leading-tight">
            Sistem Manajemen Data & Pengeluaran Karyawan
          </h2>
          <p className="mt-4 text-base text-primary-200/90 leading-relaxed">
            Kelola data karyawan, departemen, dan pengeluaran operasional PGAS Solution secara real-time, terintegrasi, dan aman.
          </p>
        </div>

        <div className="relative z-10 text-xs text-primary-400 flex items-center justify-between border-t border-primary-800/60 pt-6">
          <span>&copy; {new Date().getFullYear()} PT PGAS Solution. All rights reserved.</span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Form Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-surface-50 to-surface-100/50 relative">
        <div className="absolute top-10 right-10 lg:hidden flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold text-surface-900">PGAS Solution</span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">Selamat Datang</h2>
            <p className="text-sm text-surface-500 mt-2">Silakan masuk dengan akun kredensial Anda</p>
          </div>

          <Card className="glass-card border-none rounded-2xl shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 animate-slide-in">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-surface-700">Alamat Email</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                    <Input
                      type="email"
                      placeholder="nama@pgassolution.co.id"
                      className="pl-10 h-11 border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-surface-700">Kata Sandi</label>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                    <Input
                      type="password"
                      placeholder="•••••"
                      className="pl-10 h-11 border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : (
                    <>
                      Masuk ke Sistem <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-xs text-surface-400 lg:hidden">
            &copy; {new Date().getFullYear()} PT PGAS Solution. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
