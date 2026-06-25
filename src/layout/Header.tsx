import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import ThemeToggle from '@/components/ThemeToggle'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice'
import { useGetCartQuery } from '@/services/cartApi'
import { getUserInitial } from '@/utils/jwtDecode'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Nav link: highlights active route
// ---------------------------------------------------------------------------
function NavItem({
  to,
  end,
  children,
  onClick,
}: {
  to: string
  end?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'text-sm font-medium transition-colors hover:text-primary',
          isActive ? 'text-primary' : 'text-foreground/80',
        )
      }
    >
      {children}
    </NavLink>
  )
}

// ---------------------------------------------------------------------------
// Icon + badge wrapper for cart / wishlist
// ---------------------------------------------------------------------------
function IconBadge({
  to,
  count,
  label,
  children,
}: {
  to: string
  count: number
  label: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Search bar — navigate to /catalog?search=... on submit
// ---------------------------------------------------------------------------
function SearchForm({ className, onDone }: { className?: string; onDone?: () => void }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      navigate(`/catalog?search=${encodeURIComponent(q)}`)
      onDone?.()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex h-9 items-center gap-2 rounded-md border bg-background px-3',
        className,
      )}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you looking for?"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="Search"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Account dropdown (logged-in state)
// ---------------------------------------------------------------------------
function AccountMenu({ initial }: { initial: string }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-primary/20 transition-opacity hover:opacity-90"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link to="/profile">My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------
// Mobile nav (inside Sheet)
// ---------------------------------------------------------------------------
function MobileNav({ onClose }: { onClose: () => void }) {
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
    onClose()
  }

  return (
    <nav className="flex flex-col gap-3 py-2">
      <NavItem to="/" end onClick={onClose}>Home</NavItem>
      <NavItem to="/contact" onClick={onClose}>Contact</NavItem>
      <NavItem to="/about" onClick={onClose}>About</NavItem>

      <div className="my-1 border-t" />

      {token ? (
        <>
          <NavItem to="/profile" onClick={onClose}>My Profile</NavItem>
          <NavItem to="/orders" onClick={onClose}>My Orders</NavItem>
          <button
            onClick={handleLogout}
            className="text-left text-sm font-medium text-destructive transition-opacity hover:opacity-80"
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <NavItem to="/login" onClick={onClose}>Log In</NavItem>
          <NavItem to="/register" onClick={onClose}>Sign Up</NavItem>
        </>
      )}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
export default function Header() {
  const token = useAppSelector((state) => state.auth.token)
  const wishlistCount = useAppSelector(selectWishlistCount)
  const { data: cart } = useGetCartQuery(undefined, { skip: !token })
  const cartCount = cart?.productsInCart.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const initial = getUserInitial(token)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-1.5">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">FastCart</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
          <NavItem to="/" end>Home</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <NavItem to="/about">About</NavItem>
          {!token && <NavItem to="/register">Sign Up</NavItem>}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <SearchForm className="mr-2 hidden w-52 lg:flex" />

          <IconBadge to="/wishlist" count={wishlistCount} label="Wishlist">
            <Heart className="h-5 w-5" />
          </IconBadge>

          <IconBadge to="/cart" count={cartCount} label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </IconBadge>

          {/* Logged-out user icon */}
          {!token && (
            <Link
              to="/login"
              aria-label="Log in"
              className="hidden h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted md:inline-flex"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <ThemeToggle />

          {/* Account avatar — far right on desktop */}
          {token && (
            <span className="hidden md:inline-flex">
              <AccountMenu initial={initial} />
            </span>
          )}

          {/* Mobile burger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 px-5 pt-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              {/* Logo */}
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="mb-4 flex items-center gap-1.5"
              >
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-bold">FastCart</span>
              </Link>
              {/* Search */}
              <SearchForm
                className="mb-4 w-full"
                onDone={() => setMobileOpen(false)}
              />
              <MobileNav onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
