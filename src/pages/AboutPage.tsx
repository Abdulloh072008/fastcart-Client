import type React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Headphones, ShieldCheck, Store, Truck } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const STATS: { icon: React.ElementType; value: string; label: string; highlight?: boolean }[] = [
  { icon: Store, value: '10.5k', label: 'Sallers active our site' },
  { icon: DollarSign, value: '33k', label: 'Mopnthly Prouduct Sale', highlight: true },
  { icon: ShieldCheck, value: '45.5k', label: 'Customer active in our site' },
  { icon: Headphones, value: '25k', label: 'Anual gross sale in our site' },
]

const TEAM = [
  { name: 'Tom Cruise', role: 'Founder & Chairman' },
  { name: 'Emma Watson', role: 'Managing Director' },
  { name: 'Will Smith', role: 'Product Designer' },
]

const SERVICES = [
  { Icon: Truck, title: 'FREE AND FAST DELIVERY', desc: 'Free delivery for all orders over $140' },
  { Icon: Headphones, title: '24/7 CUSTOMER SERVICE', desc: 'Friendly 24/7 customer support' },
  { Icon: ShieldCheck, title: 'MONEY BACK GUARANTEE', desc: 'We reurn money within 30 days' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">About</span>
      </nav>

      {/* ---- Our Story ---- */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="flex flex-col md:flex-row gap-10 items-center mb-20"
      >
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Our Story</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Launced in 2015, Exclusive is South Asia's premier online shopping markerplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.
          </p>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="bg-pink-100 dark:bg-pink-900/20 rounded overflow-hidden aspect-[4/3] flex items-center justify-center">
            <div className="text-center text-muted-foreground py-10 px-6">
              <p className="text-sm">Shopping Experience</p>
              <p className="text-xs mt-2 text-muted-foreground/60">Two women with shopping bags</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ---- Stats ---- */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
      >
        {STATS.map(({ icon: Icon, value, label, highlight }) => (
          <div
            key={label}
            className={`border rounded p-6 flex flex-col items-center text-center transition-colors ${highlight ? 'bg-primary border-primary text-white' : 'border-border hover:bg-primary hover:border-primary hover:text-white group'}`}
          >
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 ${highlight ? 'border-white bg-white/20' : 'border-foreground group-hover:border-white'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className={`text-xl font-bold ${highlight ? '' : ''}`}>{value}</p>
            <p className={`text-xs mt-1 ${highlight ? 'text-white/80' : 'text-muted-foreground group-hover:text-white/80'}`}>{label}</p>
          </div>
        ))}
      </motion.section>

      {/* ---- Team ---- */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="mb-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map(({ name, role }) => (
            <div key={name} className="text-center">
              <div className="bg-[#F5F5F5] dark:bg-muted rounded mb-4 aspect-[3/4] flex items-center justify-center overflow-hidden">
                <div className="text-muted-foreground text-sm">{name.split(' ')[0]}</div>
              </div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-muted-foreground text-sm mt-0.5">{role}</p>
              <div className="flex justify-center gap-3 mt-3">
                {['tw', 'ig', 'in'].map((s) => (
                  <button key={s} className="text-foreground/60 hover:text-foreground transition-colors text-xs font-mono">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i === 2 ? 'bg-primary' : 'bg-border'}`}
            />
          ))}
        </div>
      </motion.section>

      {/* ---- Services ---- */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-border pt-14 mb-8"
      >
        {SERVICES.map(({ Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-4 border-gray-900 dark:border-white flex items-center justify-center">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </motion.section>
    </div>
  )
}
