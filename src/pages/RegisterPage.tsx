import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { FloatingField } from '@/components/FloatingField'
import { useRegisterMutation } from '@/services/accountApi'
import { registerSchema, type RegisterValues } from '@/features/auth/authSchemas'
import { getApiErrorMessage } from '@/utils/apiError'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [registerUser, { isLoading }] = useRegisterMutation()
  const reduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerUser(values).unwrap()
      toast.success('Account created — please log in.')
      navigate('/login')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create account'))
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
        Create an account
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
          label="Phone number"
          type="tel"
          autoComplete="tel"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <FloatingField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />


        <FloatingField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
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

        <FloatingField
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="mt-1 h-12 w-full text-base"
        >
          {isLoading ? 'Creating account…' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have account?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </form>
    </motion.section>
  )
}
