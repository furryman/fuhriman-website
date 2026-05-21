'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  stagger?: boolean
}

export default function ScrollReveal({ children, className = '', stagger = false }: Props) {
  return (
    <motion.div
      className={`reveal ${className}${stagger ? ' stagger' : ''}`.trim().replace(/\s+/g, ' ')}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
