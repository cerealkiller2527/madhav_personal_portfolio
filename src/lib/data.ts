import type { Project, Experience } from "./types"

export const experiences: Experience[] = [
  {
    id: "01",
    company: "Liger Mobility",
    logo: "/placeholder.svg?width=200&height=200",
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
    logo: "/placeholder.svg?width=200&height=200",
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
    logo: "/placeholder.svg?width=200&height=200",
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
    logo: "/placeholder.svg?width=200&height=200",
    role: "Product Design Engineer Intern",
    date: "September 2021 – October 2021",
    location: "Mumbai, India",
    description:
      "Upgraded Vitrum India's window lock using Fusion 360 and FEA, creating a robust snap-fit solution with telescoping rods to prevent window shattering. Rapidly prototyped the design and applied DFM principles to reduce costs by 15%.",
    stats: [{ value: "15%", label: "cost reduction" }],
    tags: ["Fusion 360", "FEA", "DFM", "Rapid Prototyping"],
  },
]

export const projects: Project[] = [
  {
    id: "01",
    title: "Underwater ROV - MATE Competition",
    subtitle: "2nd Place Globally & 1st in Engineering Presentation",
    description:
      "Led a team of 15 to build an award-winning underwater robot for cable repair and marine surveying, featuring a modular design, custom electronics, and advanced software.",
    category: "Hybrid",
    award: "2nd Place Globally",
    awardRank: "2nd place",
    stats: [
      { value: "2nd/200", label: "Global Teams" },
      { value: "1st", label: "Engineering Presentation" },
    ],
    tags: ["Robotics", "YOLOv5", "OpenCV", "Leadership"],
    liveLink: "#",
    githubLink: "#",
    heroImage: "/assets/projects/rov-hero.png",
    vectaryEmbedUrl: "https://www.vectary.com/viewer/v1/?model=0533a863-7591-498c-b413-f0999634a043&env=studio3",
    gallery: [],
    detailedDescription:
      "Directed a team of 15 in building an underwater robot for cable repair and marine life surveying. Integrated modular components, waterproof systems and custom electronics in 2 months. Oversaw software development using Ardupilot for control, YOLO v5, and OpenCV to implement color grading, contour detection, and run a fish vitality deep learning model. Designed a rotatable claw with high-torque servos and CNC-machined parts, paired with a modular six-thruster propulsion system for 6 degrees of freedom, enabling complex underwater maneuvers.",
    keyFeatures: [
      {
        title: "Advanced Vision System",
        description:
          "Utilized YOLOv5 and OpenCV for color grading, contour detection, and a fish vitality deep learning model.",
      },
      {
        title: "High-Torque Manipulator",
        description:
          "Designed a rotatable claw with high-torque servos and CNC-machined parts for precise underwater tasks.",
      },
      {
        title: "6-DoF Propulsion",
        description: "A modular six-thruster system provided 6 degrees of freedom for complex underwater maneuvers.",
      },
    ],
    techStack: [
      { name: "Ardupilot", category: "Software" },
      { name: "YOLOv5", category: "AI/ML" },
      { name: "OpenCV", category: "AI/ML" },
      { name: "Python", category: "Software" },
      { name: "Fusion 360", category: "Design" },
      { name: "CNC Machining", category: "Fabrication" },
      { name: "Raspberry Pi", category: "Hardware" },
    ],
  },
  {
    id: "02",
    title: "Tomo - AI-Powered Game",
    subtitle: "2nd Place at UMass Hackathon (500+ Participants)",
    description:
      "A Space Invaders-inspired game featuring a self-evolving LLM-driven codebase and 3D hand-tracking controls using computer vision.",
    category: "Software",
    award: "2nd @ UMass Hackathon",
    awardRank: "2nd place",
    stats: [
      { value: "2nd/500+", label: "Participants" },
      { value: "99.7%", label: "Grip Accuracy" },
    ],
    tags: ["Game Dev", "LLM", "Computer Vision", "Hackathon Winner"],
    liveLink: "#",
    githubLink: "#",
    heroImage: "/assets/projects/tomo-hero.png",
    gallery: [],
    detailedDescription:
      "To address the lack of adaptability in traditional games, we launched Tomo, a Space Invaders-inspired game featuring a self-evolving LLM-driven codebase. The game uses 3D hand-tracking controls via computer vision, achieving 99.7% grip strength accuracy for an adaptive shooting experience. This project secured 2nd place out of over 500 participants.",
    keyFeatures: [
      {
        title: "Self-Evolving Gameplay",
        description: "An LLM-driven codebase allows the game's challenges and mechanics to evolve over time.",
      },
      {
        title: "3D Hand Tracking",
        description:
          "Intuitive controls using computer vision to track hand movements for controlling the player's ship.",
      },
      {
        title: "Adaptive Shooting",
        description: "Grip strength detection with 99.7% accuracy allows for adaptive shooting mechanics.",
      },
    ],
    techStack: [
      { name: "Python", category: "Software" },
      { name: "LLM", category: "AI/ML" },
      { name: "OpenCV", category: "AI/ML" },
      { name: "Computer Vision", category: "AI/ML" },
    ],
  },
  {
    id: "03",
    title: "Frappe - AI Fridge Management",
    subtitle: "1st Place Winner at 'In Code We Trust' & 'Owl Hacks'",
    description:
      "An AI-powered system that uses computer vision to track fridge inventory, monitor expiry dates, and suggest recipes to reduce food waste.",
    category: "Hybrid",
    award: "1st Place Winner",
    awardRank: "1st place",
    stats: [
      { value: "1st Place", label: "In Code We Trust" },
      { value: "98%", label: "Detection Accuracy" },
    ],
    tags: ["AI/ML", "Flutter", "TensorFlow", "IoT"],
    liveLink: "#",
    githubLink: "#",
    heroImage: "/assets/projects/frappe-hero.png",
    gallery: [],
    detailedDescription:
      "To combat food waste from poor fridge organization, we built an AI-powered management system using TensorFlow, OpenCV, and the COCO model. The system uses a camera to automatically track items with 98% accuracy. A companion Flutter app with Firebase provides item tracking, expiry notifications, and recipe suggestions. The project won 1st place (€1000) at 'In Code We Trust' and Best Executed Hack ($50) at 'Owl Hacks.'",
    keyFeatures: [
      {
        title: "Automated Inventory",
        description: "Uses TensorFlow and OpenCV with a camera to automatically log items with a 98% accuracy rate.",
      },
      {
        title: "Smart Expiry Tracking",
        description: "A Flutter app connects to Firebase to monitor expiry dates and send notifications.",
      },
      {
        title: "Recipe Suggestions",
        description: "The app suggests recipes based on the items currently in the fridge to help reduce food waste.",
      },
    ],
    techStack: [
      { name: "Flutter", category: "Mobile" },
      { name: "Firebase", category: "Database" },
      { name: "TensorFlow", category: "AI/ML" },
      { name: "OpenCV", category: "AI/ML" },
      { name: "Python", category: "Software" },
      { name: "3D Printing", category: "Hardware" },
    ],
  },
  {
    id: "04",
    title: "T-Bot - FRC Robot",
    subtitle: "Dean's List & Innovation Challenge Semi-Finalist",
    description:
      "A competitive robot capable of shooting, collecting balls, and climbing, featuring a 9ft telescoping lift, vision tracking, and a robust 6-wheel drive.",
    category: "Hybrid",
    award: "Dean's List Semi-Finalist",
    stats: [
      { value: "80%", label: "Shooting Accuracy" },
      { value: "9 ft", label: "Lift Height" },
    ],
    tags: ["Robotics", "CAD", "Pneumatics", "FRC"],
    liveLink: "#",
    githubLink: "#",
    heroImage: "/assets/projects/frc-hero.png",
    gallery: [],
    detailedDescription:
      "As a team leader for our FIRST Robotics Competition team, I led a CAD team of 10 to design a 6-wheel-drive, hooded shooter robot. We evolved from a 50kg-capacity scissor lift to a 90kg-capacity spring-loaded telescoping lift capable of reaching 9ft. The robot featured autonomous navigation using encoders and an OpenCV targeting system, achieving 80% shooting accuracy. My contributions earned me a Dean's List Semi-Finalist nomination.",
    keyFeatures: [
      {
        title: "High-Capacity Telescoping Lift",
        description: "A spring-loaded lift capable of lifting over 90kg and reaching a height of 9ft.",
      },
      {
        title: "Accurate Hooded Shooter",
        description: "An OpenCV-powered targeting system enabled the robot to achieve 80% shooting accuracy.",
      },
      {
        title: "Autonomous Navigation",
        description: "The robot could complete autonomous tasks by utilizing encoders for precise movement.",
      },
    ],
    techStack: [
      { name: "Java", category: "Software" },
      { name: "OpenCV", category: "AI/ML" },
      { name: "SolidWorks", category: "Design" },
      { name: "Fusion 360", category: "Design" },
      { name: "Pneumatics", category: "Hardware" },
      { name: "CNC Machining", category: "Fabrication" },
    ],
  },
  {
    id: "05",
    title: "Dromous RC Plane",
    subtitle: "3rd Place at Singapore Flying Challenge",
    description:
      "Engineered a lightweight, stable, and hyper crash-resistant indoor RC plane with a modular bi-wing structure using generative design and rapid prototyping.",
    category: "Hardware",
    award: "3rd @ Singapore Challenge",
    awardRank: "3rd place",
    tags: ["Aerospace", "Fusion 360", "Generative Design", "3D Printing"],
    heroImage: "/assets/projects/rc-plane-hero.png",
    gallery: [],
    detailedDescription:
      "Engineered a lightweight, stable, and maneuverable indoor RC plane with an easy-to-repair bi-wing structure, using Fusion 360's generative design and ANSYS Fluent simulations for optimal aerodynamics. The modular design, achieved with embedded magnets, made it hyper crash-resistant and easy to repair.",
    keyFeatures: [],
    techStack: [],
  },
  {
    id: "06",
    title: "Dromous - AI Accident Detection",
    subtitle: "SCDF x IBM Hackathon Project",
    description:
      "An AI-enabled service that attaches to dash cams to automatically detect road accidents and alert authorities, using IBM Watson for vision recognition.",
    category: "Hybrid",
    tags: ["AI/ML", "IBM Watson", "IoT", "Public Safety"],
    heroImage: "/assets/projects/ai-dashcam-hero.png",
    gallery: [],
    detailedDescription:
      "An AI-enabled service that automatically detects road accidents and alerts the relevant authorities. This device attaches to any preexisting dash cam and sends data to the cloud to run deep learning models which detect crashes, achieving a 94% confidence level.",
    keyFeatures: [],
    techStack: [],
  },
  {
    id: "07",
    title: "FRC Robot - Infinite Recharge",
    subtitle: "FIRST Robotics Competition 2020 Season",
    description:
      "Designed and fabricated a competitive, industrial-sized robot with a 6-wheel drive train and a 3-stage scissors lift capable of lifting 50kg.",
    category: "Hardware",
    tags: ["Robotics", "FRC", "Mechanical Design", "Pneumatics"],
    heroImage: "/assets/projects/frc-recharge-hero.png",
    gallery: [],
    detailedDescription:
      "Designed and helped fabricate a competitive industrial-sized robot. The robot consists of a 6-wheel drive train, a 3-stage scissors lift and a ball bay to allow the robot to deposit balls and climb. The 3-stage scissors lift was able to lift 50 KG of weights.",
    keyFeatures: [],
    techStack: [],
  },
  {
    id: "08",
    title: "ECHO Assistive Devices",
    subtitle: "Together 4 Good Challenge",
    description:
      "Engineered cost-effective micro audio playback tags and a bracelet to help the visually impaired identify objects and leave messages, enabling independent living.",
    category: "Hybrid",
    tags: ["Assistive Tech", "IoT", "PCB Design", "Social Impact"],
    heroImage: "/assets/projects/echo-assist-hero.png",
    gallery: [],
    detailedDescription:
      "Designed and fabricated a set of devices that assist blind people in navigating their surroundings better. Performed a needs analysis to initiate the design process and created a wirelessly activated location tag and audio note. The design fulfilled its purpose with a community member actively using it throughout his house.",
    keyFeatures: [],
    techStack: [],
  },
  {
    id: "09",
    title: "Enabl Exoskeleton",
    subtitle: "Personal Project - Pitched to 5+ Investors",
    description:
      "Prototyped a low-cost, 3D-printed elbow exoskeleton using EMG sensors to achieve a 40% increase in force and provide significant physical support.",
    category: "Hybrid",
    tags: ["Exoskeleton", "EMG Sensors", "Arduino", "Biomechanics"],
    heroImage: "/assets/projects/exoskeleton-hero.png",
    gallery: [],
    detailedDescription:
      "Prototyped a low-cost, 3D-printed elbow exoskeleton using EMG sensors, stepper motors, and Arduino, achieving a 40% increase in force and significant physical support. Developed a detailed business proposal for custom exoskeleton solutions utilizing photogrammetry and 3D printing.",
    keyFeatures: [],
    techStack: [],
  },
  {
    id: "10",
    title: "DIY Ventilator",
    subtitle: "Personal Project for COVID-19 Response",
    description:
      "Developed a low-cost, 3D-printed ventilator with a motorized Ambu-Bag mechanism for rapid deployment during the COVID-19 crisis.",
    category: "Hybrid",
    tags: ["Medical Device", "3D Printing", "Arduino", "Social Impact"],
    heroImage: "/assets/projects/ventilator-hero.png",
    gallery: [],
    detailedDescription:
      "Developed a low-cost, 3D-printed ventilator with a motorized Ambu-Bag mechanism for rapid manufacturing and deployment during critical COVID-19 situations. Prototyped a ventilator with adjustable airflow and oxygen levels, integrating temperature and humidity sensors for data logging, and implemented a Raspberry Pi server for hospitals to monitor performance.",
    keyFeatures: [],
    techStack: [],
  },
]
