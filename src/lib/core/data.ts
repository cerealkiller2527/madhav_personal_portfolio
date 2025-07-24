import type { Experience } from "@/lib/schemas"

// Site Information
export const siteInfo = {
  name: "Madhav Lodha",
  title: "Madhav Lodha",
  description: "Robotics Engineering & Computer Science Major at WPI.",
  tagline: "Innovating at the Intersection of Hardware and Code",
  heroTitle: "Hey, I'm Madhav Lodha",
  bio: "I bring intelligent machines to life, crafting both the code and the hardware that powers them.",
  email: "madhavlodha2503@gmail.com",
  copyright: `© ${new Date().getFullYear()} Madhav Lodha. All Rights Reserved.`,
  avatarLogo: "/assets/portfolio/avatar-logo.png",
  avatarTransparent: "/assets/portfolio/avatar-transparent.png",
  avatarAlt: "Madhav Lodha Avatar",
}

// Button Labels
export const buttonLabels = {
  viewResume: "View Résumé",
  viewMyWork: "View My Work",
  showMoreProjects: "Show More Projects",
  showLessProjects: "Show Less Projects",
  viewAllPosts: "View All Posts",
  download: "Download",
  tryAgain: "Try Again",
  goHome: "Go Home",
  goBack: "Go Back",
}

// Footer Data
export const footerData = {
  sections: {
    connect: {
      title: "Connect",
      links: [
        { href: "https://www.linkedin.com/in/madhavlodha/", label: "LinkedIn" },
        { href: "https://github.com/MadhavLodha", label: "GitHub" },
        { href: "mailto:madhavlodha2503@gmail.com", label: "Email" },
      ]
    },
    work: {
      title: "Work",
      links: [
        { href: "#", label: "Underwater ROV" },
        { href: "#", label: "Tomo AI Game" },
        { href: "#", label: "Frappe Fridge Manager" },
        { href: "#", label: "T-Bot FRC Robot" },
      ]
    }
  },
  socialIcons: [
    {
      href: "https://www.linkedin.com/in/madhavlodha/",
      ariaLabel: "LinkedIn",
      icon: "linkedin"
    },
    {
      href: "https://github.com/MadhavLodha",
      ariaLabel: "GitHub", 
      icon: "github"
    },
    {
      href: "mailto:madhavlodha2503@gmail.com",
      ariaLabel: "Email",
      icon: "mail"
    }
  ]
}

export const experiences: readonly Experience[] = [
  {
    id: "01",
    company: "Liger Mobility",
    logo: "/assets/placeholders/placeholder-logo.svg",
    role: "Embedded Systems & Software Intern",
    date: "May 2024 – July 2024",
    location: "Mumbai, India",
    description:
      "Developed a Flutter-based scooter testing app with Firebase, capturing over 1.7M weekly data points. Integrated a Bluetooth module with custom data compression, and designed a PID-controlled assisted steering system, reducing rider effort by 90%.",
    stats: [
      { value: "1.7M+", label: "weekly data points" },
      { value: "90%", label: "reduction in rider effort" },
      { value: "50ms", label: "steering latency" },
    ],
    tags: ["Flutter", "Firebase", "AWS IoT", "PID Control", "Embedded Systems"],
  },
  {
    id: "hcl",
    company: "HCLTech",
    logo: "/assets/placeholders/placeholder-logo.svg",
    role: "Robotics Engineering Intern",
    date: "Jan 2024 – Apr 2024",
    location: "Boston, MA",
    description:
      "Engineered a dual-arm robotic system for automated quality assessment of Meta Ray-Ban smart glasses. Developed complex manipulation sequences for placing glasses and running optical simulations, contributing to a potential $40M partnership deal.",
    stats: [
      { value: "$40M", label: "Potential Deal Value" },
      { value: "Dual-Arm", label: "Robot System" },
    ],
    tags: ["Robotics", "Computer Vision", "Automation", "ROS", "Quality Assurance"],
  },
  {
    id: "02",
    company: "Ayurythm",
    logo: "/assets/placeholders/placeholder-logo.svg",
    role: "Test Design Engineer Intern",
    date: "April 2022 – July 2022",
    location: "Bangalore, India",
    description:
      "Engineered a health sensor testing platform for 30 developers, impacting over 750,000 app users. Designed a compact PCB and 3D-printed chassis, reducing costs by 40%, and enhanced sensor accuracy with Kalman Filter signal processing.",
    stats: [
      { value: "750k+", label: "app users impacted" },
      { value: "40%", label: "cost reduction" },
    ],
    tags: ["Arduino", "Altium Designer", "Signal Processing", "3D Printing", "Health Tech"],
  },
  {
    id: "03",
    company: "Design Flyover",
    logo: "/assets/placeholders/placeholder-logo.svg",
    role: "Product Design Engineer Intern",
    date: "September 2021 – October 2021",
    location: "Mumbai, India",
    description:
      "Upgraded Vitrum India's window lock using Fusion 360 and FEA, creating a robust snap-fit solution with telescoping rods to prevent window shattering. Rapidly prototyped the design and applied DFM principles to reduce costs by 15%.",
    stats: [{ value: "15%", label: "cost reduction" }],
    tags: ["Fusion 360", "FEA", "DFM", "Rapid Prototyping"],
  },
]