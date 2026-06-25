import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronRight,
  Gamepad2,
  Headphones,
  Monitor,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  Watch,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetProductsQuery } from '@/services/productsApi'
import { useGetCategoriesQuery } from '@/services/catalogApi'
import ProductCard from '@/components/ProductCard'
import type { Category } from '@/types'
import { getImageUrl } from '@/utils/imageUrl'
import 'swiper/css'
import 'swiper/css/navigation'
import ps5 from "../assets/ps5-slim-goedkope-playstation_large 1 (1).png"
import img from "../assets/hero_endframe__cvklg0xk3w6e_large 2 (2).png"

// ============================================================
// Flash Sale end (module-level — not called during render)
// ============================================================
const SALE_END_MS = Date.now() + 3 * 24 * 3_600_000

// ============================================================
// Countdown hook
// ============================================================
function getTimeLeft(endMs: number) {
  const diff = Math.max(0, endMs - Date.now())
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
    expired: diff === 0,
  }
}

function useCountdown(endMs: number) {
  const [left, setLeft] = useState(() => getTimeLeft(endMs))
  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft(endMs)), 1000)
    return () => clearInterval(id)
  }, [endMs])
  return left
}

// ============================================================
// CategoryThumb — shows API image with icon fallback
// ============================================================
function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const n = name.toLowerCase()
  if (n.includes('phone') || n.includes('mobile')) return <Smartphone className={className} />
  if (n.includes('computer') || n.includes('laptop')) return <Monitor className={className} />
  if (n.includes('watch')) return <Watch className={className} />
  if (n.includes('camera') || n.includes('photo')) return <Camera className={className} />
  if (n.includes('headphone') || n.includes('audio') || n.includes('sound'))
    return <Headphones className={className} />
  if (n.includes('game') || n.includes('gaming')) return <Gamepad2 className={className} />
  return <ShoppingBag className={className} />
}

function CategoryThumb({
  imagePath,
  name,
  iconClass = 'w-8 h-8',
  imgClass = 'w-12 h-12 object-contain',
}: {
  imagePath: string
  name: string
  iconClass?: string
  imgClass?: string
}) {
  const [failed, setFailed] = useState(false)
  const src = getImageUrl(imagePath)

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        className={imgClass}
        onError={() => setFailed(true)}
      />
    )
  }
  return <CategoryIcon name={name} className={iconClass} />
}

// ============================================================
// Section label (red bar + red text)
// ============================================================
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-10 rounded bg-primary" />
      <span className="text-primary text-sm font-semibold">{children}</span>
    </div>
  )
}

// ============================================================
// Countdown boxes
// ============================================================
function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">{label}</span>
      <span className="text-xl sm:text-2xl font-bold tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
    </div>
  )
}

function CircleCount({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex flex-col items-center justify-center shadow">
      <span className="text-xs font-bold text-black tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] text-gray-500 leading-none mt-0.5">{label}</span>
    </div>
  )
}

// ============================================================
// Arrow button
// ============================================================
function ArrowBtn({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
    >
      {dir === 'prev' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
    </button>
  )
}

// ============================================================
// Static hero banners
// ============================================================
const HERO_SLIDES = [
  {
    eyebrow: 'iPhone 14 Series',
    heading: 'Up to 10%\noff Voucher',
    cta: 'Shop Now',
    href: '/catalog',
    accent: 'from-purple-600 to-indigo-800',
  },
  {
    eyebrow: 'New Collection',
    heading: 'Exclusive\nDeals Today',
    cta: 'Explore Now',
    href: '/catalog',
    accent: 'from-blue-600 to-cyan-700',
  },
  {
    eyebrow: 'Best Sellers',
    heading: 'Premium\nProducts',
    cta: 'View All',
    href: '/catalog',
    accent: 'from-emerald-700 to-teal-800',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ============================================================
// Desktop subcategory flyout (beautiful version)
// ============================================================
function SubcategoryFlyout({
  cat,
  onEnter,
  onLeave,
}: {
  cat: Category
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <motion.div
      key="flyout"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute left-full top-0 min-h-full w-64 bg-background shadow-2xl border-l border-border z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-primary px-5 py-4 shrink-0 flex items-center gap-3">
        <CategoryThumb
          imagePath={cat.categoryImage}
          name={cat.categoryName}
          imgClass="w-8 h-8 object-contain rounded brightness-0 invert"
          iconClass="w-6 h-6 text-white"
        />
        <h3 className="text-white font-bold text-sm">{cat.categoryName}</h3>
      </div>

      {/* Subcategory list */}
      <nav className="flex-1 py-1 overflow-y-auto">
        {cat.subCategories.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.15 }}
          >
            <Link
              to={`/catalog?SubcategoryId=${sub.id}`}
              className="flex items-center justify-between px-5 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 border-b border-border/40 last:border-0 transition-colors"
            >
              <span>{sub.subCategoryName}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-muted/30 shrink-0">
        <Link
          to={`/catalog?CategoryId=${cat.id}`}
          className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
        >
          View all in {cat.categoryName}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  )
}

// ============================================================
// HomePage
// ============================================================
export default function HomePage() {
  const countdown = useCountdown(SALE_END_MS)
  const flashRef = useRef<SwiperType | null>(null)
  const catRef = useRef<SwiperType | null>(null)

  // Desktop flyout
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function openFlyout(cat: Category) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setHoveredCat(cat)
  }
  function scheduledClose() {
    closeTimer.current = setTimeout(() => setHoveredCat(null), 150)
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  // Mobile accordion
  const [expandedMobileCat, setExpandedMobileCat] = useState<number | null>(null)

  const { data: productsData, isLoading: prodsLoading } = useGetProductsQuery({ PageSize: 50 })
  const { data: categories, isLoading: catsLoading } = useGetCategoriesQuery()

  const allProducts = productsData?.data.products ?? []
  const flashSaleProducts = allProducts.filter((p) => p.hasDiscount)
  const bestSelling = allProducts.slice(0, 4)
  const exploreProducts = allProducts.slice(0, 8)

  return (
    <div className="-mt-6 -mb-6">
      {/* ================================================================ */}
      {/* HERO — categories + banner                                        */}
      {/* ================================================================ */}
      <section className="-mx-4 border-b border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row lg:items-stretch">

            {/* ---- Categories ---- */}
            <aside className="lg:w-[220px] lg:shrink-0 lg:border-r lg:border-border lg:py-4 lg:pr-4 lg:relative lg:z-30">

              {/* MOBILE: visible list above banner */}
              <div className="lg:hidden py-2 border-b border-border mb-0">
                {catsLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 mb-1 rounded" />
                  ))
                  : (categories ?? []).map((cat) => (
                    <div key={cat.id} className="border-b border-border/40 last:border-0">
                      {cat.subCategories.length > 0 ? (
                        <>
                          <button
                            onClick={() =>
                              setExpandedMobileCat(
                                expandedMobileCat === cat.id ? null : cat.id,
                              )
                            }
                            className="w-full flex items-center justify-between py-2.5 px-2 text-sm hover:text-primary transition-colors"
                          >
                            <span>{cat.categoryName}</span>
                            <ChevronRight
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expandedMobileCat === cat.id ? 'rotate-90 text-primary' : ''
                                }`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expandedMobileCat === cat.id && (
                              <motion.div
                                key={cat.id}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-muted/30"
                              >
                                <div className="px-5 py-1">
                                  {cat.subCategories.map((sub) => (
                                    <Link
                                      key={sub.id}
                                      to={`/catalog?SubcategoryId=${sub.id}`}
                                      className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                                      {sub.subCategoryName}
                                    </Link>
                                  ))}
                                  <Link
                                    to={`/catalog?CategoryId=${cat.id}`}
                                    className="flex items-center gap-1 py-2 text-xs text-primary font-semibold hover:underline"
                                  >
                                    View all <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={`/catalog?CategoryId=${cat.id}`}
                          className="flex items-center justify-between py-2.5 px-2 text-sm hover:text-primary transition-colors"
                        >
                          {cat.categoryName}
                        </Link>
                      )}
                    </div>
                  ))}
              </div>

              {/* DESKTOP: sidebar with hover flyout */}
              <div className="hidden lg:flex flex-col">
                {catsLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 mb-1 rounded" />
                  ))
                  : (categories ?? []).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?CategoryId=${cat.id}`}
                      onMouseEnter={() =>
                        cat.subCategories.length > 0 ? openFlyout(cat) : setHoveredCat(null)
                      }
                      onMouseLeave={() =>
                        cat.subCategories.length > 0 ? scheduledClose() : undefined
                      }
                      className="flex items-center justify-between py-2 px-1 text-sm hover:text-primary transition-colors group"
                    >
                      <span>{cat.categoryName}</span>
                      {cat.subCategories.length > 0 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      )}
                    </Link>
                  ))}

                {/* Desktop flyout panel */}
                <AnimatePresence>
                  {hoveredCat && hoveredCat.subCategories.length > 0 && (
                    <SubcategoryFlyout
                      cat={hoveredCat}
                      onEnter={cancelClose}
                      onLeave={scheduledClose}
                    />
                  )}
                </AnimatePresence>
              </div>
            </aside>

            {/* ---- Banner Swiper ---- */}
            <div className="flex-1 overflow-hidden py-7 lg:ml-10">
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop
                className="w-full h-full"
              >
                {HERO_SLIDES.map((slide) => (
                  <SwiperSlide key={slide.eyebrow}>
                    <div className="  bg-black flex justify-between items-center min-h-[280px] sm:min-h-[380px] lg:min-h-[350px] px-8 sm:px-10 overflow-hidden">
                      <div className="relative z-10 text-white">
                        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{slide.eyebrow}</p>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6 whitespace-pre-line">
                          {slide.heading}
                        </h1>
                        <Link
                          to={slide.href}
                          className="inline-flex items-center gap-2 text-white border-b-2 border-white pb-0.5 hover:text-primary hover:border-primary transition-colors text-sm font-medium"
                        >
                          {slide.cta} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className={`${slide.accent}`} >
                        <img className='' src={img} alt="" />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FLASH SALES                                                       */}
      {/* ================================================================ */}
      <section className="py-8 sm:py-12">
        <SectionTag>Today's</SectionTag>

        <div className="flex items-end justify-between mt-4 mb-6 sm:mb-8 gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Flash Sales</h2>

          {!countdown.expired && (
            <div className="flex items-end gap-2 sm:gap-3">
              <CountBox value={countdown.d} label="Days" />
              <span className="text-xl font-bold text-primary pb-0.5">:</span>
              <CountBox value={countdown.h} label="Hours" />
              <span className="text-xl font-bold text-primary pb-0.5">:</span>
              <CountBox value={countdown.m} label="Minutes" />
              <span className="text-xl font-bold text-primary pb-0.5">:</span>
              <CountBox value={countdown.s} label="Seconds" />
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <ArrowBtn dir="prev" onClick={() => flashRef.current?.slidePrev()} />
            <ArrowBtn dir="next" onClick={() => flashRef.current?.slideNext()} />
          </div>
        </div>

        {prodsLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 flex-1 rounded" />
            ))}
          </div>
        ) : flashSaleProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No sale items at the moment.</p>
        ) : (
          <Swiper
            onSwiper={(s) => { flashRef.current = s }}
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              640: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
              1280: { slidesPerView: 5, spaceBetween: 16 },
            }}
          >
            {flashSaleProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/catalog"
            className="border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-10 sm:px-12 py-2.5 sm:py-3 rounded-sm text-sm font-medium"
          >
            View All Products
          </Link>
        </div>
      </section>

      <hr className="border-border" />

      {/* ================================================================ */}
      {/* BROWSE BY CATEGORY                                               */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-8 sm:py-12"
      >
        <SectionTag>Categories</SectionTag>

        <div className="flex items-center justify-between mt-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Browse By Category</h2>
          <div className="flex gap-2">
            <ArrowBtn dir="prev" onClick={() => catRef.current?.slidePrev()} />
            <ArrowBtn dir="next" onClick={() => catRef.current?.slideNext()} />
          </div>
        </div>

        {catsLoading ? (
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 flex-1 rounded" />
            ))}
          </div>
        ) : (
          <Swiper
            onSwiper={(s) => { catRef.current = s }}
            spaceBetween={12}
            slidesPerView={3}
            breakpoints={{
              480: { slidesPerView: 4, spaceBetween: 16 },
              768: { slidesPerView: 5, spaceBetween: 16 },
              1024: { slidesPerView: 6, spaceBetween: 16 },
            }}
          >
            {(categories ?? []).map((cat, idx) => (
              <SwiperSlide key={cat.id}>
                <Link
                  to={`/catalog?CategoryId=${cat.id}`}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-3 h-24 sm:h-28 border rounded-sm transition-colors group ${idx === 0
                      ? 'bg-primary border-primary text-white'
                      : 'border-border bg-card hover:bg-primary hover:border-primary hover:text-white'
                    }`}
                >
                  {/* category image from API, fallback to icon */}
                  <CategoryThumb
                    imagePath={cat.categoryImage}
                    name={cat.categoryName}
                    imgClass="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    iconClass="w-7 h-7 sm:w-8 sm:h-8"
                  />
                  <span className="text-[10px] sm:text-xs font-medium text-center px-1 leading-tight">
                    {cat.categoryName}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </motion.section>

      <hr className="border-border" />

      {/* ================================================================ */}
      {/* BEST SELLING PRODUCTS                                            */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-8 sm:py-12"
      >
        <SectionTag>This Month</SectionTag>

        <div className="flex items-center justify-between mt-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Best Selling Products</h2>
          <Link
            to="/catalog"
            className="bg-primary text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            View All
          </Link>
        </div>

        {prodsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {bestSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* ================================================================ */}
      {/* MUSIC PROMO BANNER                                               */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="-mx-4 py-2 sm:py-4"
      >
        <div className="bg-black overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center min-h-[260px] sm:min-h-[300px]">
            <div className="flex-1 p-6 sm:p-10 text-white">
              <p className="text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Categories</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-5 sm:mb-8">
                Enhance Your<br />Music Experience
              </h2>
              <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-8">
                <CircleCount value={countdown.d} label="Days" />
                <CircleCount value={countdown.h} label="Hours" />
                <CircleCount value={countdown.m} label="Min" />
                <CircleCount value={countdown.s} label="Sec" />
              </div>
              <Link
                to="/catalog"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-sm transition-colors text-sm"
              >
                Buy Now!
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56">
                <div className="absolute inset-0 rounded-full bg-gray-700 opacity-40" />
                <div className="absolute inset-4 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300" fill="currentColor">
                    <ellipse cx="40" cy="40" rx="28" ry="32" />
                    <ellipse cx="40" cy="40" rx="8" ry="10" fill="#111" />
                    <rect x="26" y="8" width="4" height="16" rx="2" />
                    <rect x="50" y="8" width="4" height="16" rx="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/* EXPLORE OUR PRODUCTS                                             */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-8 sm:py-12"
      >
        <SectionTag>Our Products</SectionTag>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 mb-6 sm:mb-8">Explore Our Products</h2>

        {prodsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded" />
            ))}
          </div>
        ) : exploreProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {exploreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/catalog"
            className="border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-10 sm:px-12 py-2.5 sm:py-3 rounded-sm text-sm font-medium"
          >
            View All Products
          </Link>
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/* NEW ARRIVAL                                                       */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-8 sm:py-12"
      >
        <SectionTag>Featured</SectionTag>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 mb-6 sm:mb-8">New Arrival</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left — PS5 large card */}
          <Link
            to="/catalog"
            className="group relative bg-gray-900 rounded-sm overflow-hidden flex items-end p-5 sm:p-6 min-h-[280px] sm:min-h-[500px] hover:opacity-95 transition-opacity"
          >
            <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-950 flex items-center justify-center">
              <img src={ps5} alt="" />
            </div>
            <div className="relative z-10 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-1">PlayStation 5</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 max-w-xs">
                Black and white version of the PS5 coming out on sale.
              </p>
              <span className="inline-flex items-center gap-1 text-white border-b border-white pb-0.5 text-sm group-hover:text-primary group-hover:border-primary transition-colors">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Right — 3 cards */}
          <div className="grid grid-rows-2 gap-4">
            {/* Women's Collections */}
            <Link
              to="/catalog"
              className="group relative bg-stone-100 dark:bg-stone-800 rounded-sm overflow-hidden flex items-end p-5 sm:p-6 min-h-[160px] hover:opacity-95 transition-opacity"
            >
              <div className="absolute inset-0 flex items-center justify-end pr-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-stone-200 dark:bg-stone-700 opacity-60" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Women's Collections</h3>
                <p className="text-xs text-muted-foreground mb-2 sm:mb-3 max-w-[200px]">
                  Featured women collections that give you another vibe.
                </p>
                <span className="inline-flex items-center gap-1 text-foreground border-b border-foreground pb-0.5 text-sm group-hover:text-primary group-hover:border-primary transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Speakers + Perfume */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/catalog"
                className="group relative bg-gray-800 rounded-sm overflow-hidden flex items-end p-4 sm:p-5 min-h-[130px] hover:opacity-95 transition-opacity"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-600 opacity-40" />
                </div>
                <div className="relative z-10 text-white">
                  <h3 className="text-xs sm:text-sm font-bold mb-0.5">Speakers</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Amazon wireless speakers</p>
                  <span className="inline-flex items-center gap-1 text-white border-b border-white pb-0.5 text-xs group-hover:text-primary group-hover:border-primary transition-colors">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>

              <Link
                to="/catalog"
                className="group relative bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden flex items-end p-4 sm:p-5 min-h-[130px] hover:opacity-95 transition-opacity"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-16 rounded bg-gray-300 dark:bg-gray-600 opacity-50" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground mb-0.5">Perfume</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">GUCCI INTENSE OUD EDP</p>
                  <span className="inline-flex items-center gap-1 text-foreground border-b border-foreground pb-0.5 text-xs group-hover:text-primary group-hover:border-primary transition-colors">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/* SERVICES                                                          */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-10 sm:py-16 border-t border-border"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          {[
            {
              Icon: Truck,
              title: 'FREE AND FAST DELIVERY',
              desc: 'Free delivery for all orders over $140',
            },
            {
              Icon: Headphones,
              title: '24/7 CUSTOMER SERVICE',
              desc: 'Friendly 24/7 customer support',
            },
            {
              Icon: ShieldCheck,
              title: 'MONEY BACK GUARANTEE',
              desc: 'We return money within 30 days',
            },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-gray-900 dark:border-white flex items-center justify-center">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
