import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const features = [
  {
    title: "Code Explainer",
    description: "Paste your code and get line-by-line explanations that break down complex concepts into simple terms.",
    icon: "code",
    color: "secondary",
    codeExample: "for i in range(10): # Loops from 0 to 9",
    link: "/code-explanation"
  },
  {
    title: "Error Translator",
    description: "Transform cryptic error messages into clear, actionable steps to fix your code and understand what went wrong.",
    icon: "bug",
    color: "error",
    errorMessage: "TypeError: 'int' object is not iterable",
    errorExplanation: "You're trying to loop through a number, but you can only loop through collections like lists.",
    link: "/code-feedback"
  },
  {
    title: "Project Generator",
    description: "Get customized project ideas based on your skill level, interests, and technologies you want to learn.",
    icon: "lightbulb",
    color: "accent",
    projectExample: "Beginner Python Project: Build a personal expense tracker with data visualization",
    link: "/project-ideas"
  }
];

export const steps = [
  {
    number: 1,
    title: "Paste Your Code",
    description: "Copy and paste your code into our editor. We support multiple programming languages including Python, JavaScript, Java, C++, and more."
  },
  {
    number: 2,
    title: "Select Your Tool",
    description: "Choose what you need: understand your code, translate an error message, or generate a new project idea that matches your learning goals."
  },
  {
    number: 3,
    title: "Get Instant Results",
    description: "Our AI analyzes your input and provides detailed explanations, simplified error messages, or tailored project ideas in seconds."
  }
];

export const testimonials = [
  {
    name: "Alex Johnson",
    role: "Computer Science Student",
    content: "CodeBuddy helped me understand complex programming concepts I was struggling with. The line-by-line explanations finally made recursion click for me!"
  },
  {
    name: "Priya Sharma",
    role: "Web Development Bootcamp",
    content: "The error translator is a game-changer! No more wasting hours on cryptic error messages. It tells me exactly what went wrong and how to fix it."
  },
  {
    name: "Marcus Chen",
    role: "Self-taught Developer",
    content: "The project generator gave me fresh ideas when I was stuck in a learning plateau. I've built three projects from suggestions and learned so much!"
  }
];

export const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    description: "Perfect for students just getting started",
    features: [
      "5 code explanations per day",
      "5 error translations per day",
      "3 project ideas per week",
      "Basic code editor"
    ],
    cta: "Get Started",
    link: "#",
    highlight: false
  },
  {
    title: "Pro",
    price: "$9.99",
    description: "For dedicated students and beginners",
    features: [
      "Unlimited code explanations",
      "Unlimited error translations",
      "10 project ideas per week",
      "Advanced code editor with saving",
      "Priority support"
    ],
    cta: "Start 7-Day Free Trial",
    link: "#",
    highlight: true,
    badge: "MOST POPULAR"
  },
  {
    title: "Teams",
    price: "$19.99",
    description: "For study groups and small classes",
    features: [
      "Everything in Pro plan",
      "Up to 5 team members",
      "Collaborative code editor",
      "Code history & version control",
      "Team project management"
    ],
    cta: "Contact Sales",
    link: "#",
    highlight: false
  }
];
