"use client"
import type React from "react"
import Link from "next/link"
import { Linkedin, Github, Mail } from "lucide-react"

const connectLinks = [
  { href: "https://www.linkedin.com/in/madhavlodha/", label: "LinkedIn" },
  { href: "https://github.com/MadhavLodha", label: "GitHub" },
  { href: "mailto:madhavlodha2503@gmail.com", label: "Email" },
]

const workLinks = [
  { href: "#", label: "Underwater ROV" },
  { href: "#", label: "Tomo AI Game" },
  { href: "#", label: "Frappe Fridge Manager" },
  { href: "#", label: "T-Bot FRC Robot" },
]

const FooterLink = ({
  href,
  children,
  isExternal,
}: { href: string; children: React.ReactNode; isExternal?: boolean }) => (
  <Link
    href={href}
    className="block text-white/80 hover:text-white transition-colors text-sm"
    {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
  >
    {children}
  </Link>
)

const LinkSection = ({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) => (
  <div>
    <h4 className="text-white font-semibold text-sm mb-2">{title}</h4>
    <div className="space-y-1.5">
      {links.map((link) => (
        <FooterLink
          key={link.label}
          href={link.href}
          isExternal={link.href.startsWith("http") || link.href.startsWith("mailto")}
        >
          {link.label}
        </FooterLink>
      ))}
    </div>
  </div>
)

export function Footer() {
  return (
    <footer id="contact" className="relative bg-[#E85A2B] overflow-hidden py-10 md:py-12">
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">Madhav Lodha</h1>
            <p className="text-white/80 text-base mt-2 max-w-2xl">
              Robotics Engineering & Computer Science Major at WPI.
            </p>
            <p className="text-sm text-white/60 mt-6">
              © {new Date().getFullYear()} Madhav Lodha. All Rights Reserved.
            </p>
          </div>

          <div className="md:col-span-1 lg:col-span-2 flex flex-col sm:flex-row sm:justify-end gap-8">
            <div className="flex gap-8">
              <LinkSection title="Connect" links={connectLinks} />
              <LinkSection title="Work" links={workLinks} />
            </div>
            <div className="flex items-start gap-3">
              <a
                href="https://www.linkedin.com/in/madhavlodha/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/30 rounded flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/MadhavLodha"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/30 rounded flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:madhavlodha2503@gmail.com"
                className="w-8 h-8 border border-white/30 rounded flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
