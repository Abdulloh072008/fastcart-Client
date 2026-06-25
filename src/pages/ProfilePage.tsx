import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/app/hooks'
import { useGetProfileByIdQuery, useUpdateProfileMutation } from '@/services/profileApi'
import { getUserId } from '@/utils/jwtDecode'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  streetAddress: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const NAV = [
  {
    title: 'Manage My Account',
    items: [
      { label: 'My Profile', to: '/profile', active: true },
      { label: 'Address Book', to: '/profile' },
      { label: 'My Payment Options', to: '/profile' },
    ],
  },
  {
    title: 'My Orders',
    items: [
      { label: 'My Returns', to: '/orders' },
      { label: 'My Cancellations', to: '/orders' },
    ],
  },
  {
    title: 'My WishList',
    items: [{ label: 'My WishList', to: '/wishlist' }],
  },
]

export default function ProfilePage() {
  const token = useAppSelector((s) => s.auth.token)
  const userId = getUserId(token)

  const { data: profile, isLoading } = useGetProfileByIdQuery(userId, { skip: !userId })
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        streetAddress: '',
      })
    }
  }, [profile, reset])

  async function onSubmit(data: FormData) {
    try {
      await updateProfile({
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        PhoneNumber: profile?.phoneNumber ?? '',
        Dob: profile?.dob ?? new Date().toISOString().split('T')[0],
        Image: null,
      }).unwrap()
      toast.success('Profile updated')
    } catch {
      toast.error('Could not update profile')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">My Account</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="md:w-[220px] shrink-0 space-y-6">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-sm mb-2">{section.title}</p>
              <ul className="space-y-1 pl-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={`text-sm transition-colors ${item.active ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-card border border-border rounded shadow-sm p-6 sm:p-8">
              <h2 className="text-primary font-semibold text-lg mb-6">Profile</h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 rounded" />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">First name</label>
                      <Input {...register('firstName')} placeholder="First name" className={errors.firstName ? 'border-destructive' : ''} />
                      {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Last name</label>
                      <Input {...register('lastName')} placeholder="Last name" className={errors.lastName ? 'border-destructive' : ''} />
                      {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Email address</label>
                      <Input type="email" {...register('email')} placeholder="Email address" className={errors.email ? 'border-destructive' : ''} />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Street address</label>
                      <Input {...register('streetAddress')} placeholder="Street address" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm mb-4">Password Changes</h3>
                  <div className="space-y-3 mb-6">
                    <Input type="password" {...register('currentPassword')} placeholder="Current password" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input type="password" {...register('newPassword')} placeholder="New password" />
                      <Input type="password" {...register('confirmPassword')} placeholder="Confirm new password" />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-4 mt-2">
                <button type="button" onClick={() => reset()} className="text-sm hover:text-primary transition-colors">
                  Cancel
                </button>
                <Button type="submit" disabled={saving} className="bg-primary text-white hover:bg-primary/90 px-8">
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
