"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Experience } from "@/lib/types"
import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/core/utils"
import { MapPin, Building2 } from "lucide-react"

interface ExperienceSectionProps {
  experiences: readonly Experience[]
}

const listVariants = {
  visible: { transition: { staggerChildren: 0.07 } },
  hidden: {},
}

const itemVariants = {
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      ease: [0.4, 0.0, 0.2, 1.0] as const, 
      duration: 0.3 
    } 
  },
  hidden: { opacity: 0, x: -20 },
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [selected, setSelected] = useState<Experience>(experiences[0])

  return (
    <Section title="Work Experience" id="experience" hasBackground>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 min-h-[480px]">
        <motion.div
          className="md:col-span-1 flex flex-col gap-4"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {experiences.map((exp) => (
            <motion.button
              key={exp.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(exp)}
              className="w-full text-left"
            >
              <Card
                variant="glass"
                className={cn(
                  "shadow-md",
                  selected.id === exp.id && "bg-primary/10 border-primary/30 shadow-primary/20"
                )}
              >
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground">{exp.company}</h3>
                  <p className="text-sm text-muted-foreground truncate">{exp.role}</p>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </motion.div>

        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Card variant="glass" className="relative overflow-hidden h-full">
                <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-80" />
                <CardContent className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg glass-subtle flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{selected.company}</h3>
                      <p className="text-md text-primary font-semibold">{selected.role}</p>
                      <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:gap-4">
                        <span>{selected.date}</span>
                        {selected.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {selected.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{selected.description}</p>

                  {selected.stats && selected.stats.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      {selected.stats.map((stat) => (
                        <Card key={stat.label} variant="glass-static" className="text-center">
                          <CardContent className="p-3">
                            <p className="text-xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
