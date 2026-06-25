import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Contact</span>
      </nav>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Left — contact info */}
        <div className="md:w-[280px] shrink-0 border border-border rounded p-8 shadow-sm space-y-8">
          {/* Call To Us */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold">Call To Us</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-1">We are available 24/7, 7 days a week.</p>
            <p className="text-sm">Phone: +8801611112222</p>
          </div>

          <hr className="border-border" />

          {/* Write To US */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold">Write To US</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Fill out our form and we will contact you within 24 hours.</p>
            <p className="text-sm mb-0.5">Emails: customer@exclusive.com</p>
            <p className="text-sm">Emails: support@exclusive.com</p>
          </div>
        </div>

        {/* Right — message form */}
        <div className="flex-1 border border-border rounded p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input placeholder="Name" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Phone" type="tel" />
          </div>
          <textarea
            placeholder="Your Message"
            rows={7}
            className="w-full border border-border rounded px-4 py-3 text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary mb-6"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {}}
              className="bg-primary text-white hover:bg-primary/90 px-10"
            >
              Send Message
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
