import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { FloatingField } from '@/components/FloatingField'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from '@/features/auth/authSlice'
import { useLoginMutation } from '@/services/accountApi'
import { loginSchema, type LoginValues } from '@/features/auth/authSchemas'
import { getApiErrorMessage } from '@/utils/apiError'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [login, { isLoading }] = useLoginMutation()
  const reduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    try {
      const token = await login(values).unwrap()
      dispatch(setCredentials({ token }))
      toast.success('Welcome back!')
      // Send the user back where they came from (set by ProtectedRoute / 401), else home.
      const redirect = searchParams.get('redirect')
      navigate(redirect || '/', { replace: true })
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Invalid username or password'))
    }
  }

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center py-12"
    >
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Log in to FastCart
      </h1>
      <p className="mt-3 text-muted-foreground">Enter your details below</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 flex flex-col gap-5"
      >
        <FloatingField
          label="UserName"
          autoComplete="username"
          error={errors.userName?.message}
          {...register('userName')}
        />

        <FloatingField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={errors.password?.message}
          rightSlot={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          }
          {...register('password')}
        />

        <div className="text-center">
          <span className="text-sm font-medium text-primary">
            Forget Password?
          </span>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-12 w-full text-base"
        >
          {isLoading ? 'Logging in…' : 'Log In'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </motion.section>
  )
}
