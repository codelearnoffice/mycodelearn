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
    name: "Aarav Patel",
    role: "Engineering Student, Mumbai",
    content: "SimpleCodr made DSA and Python so easy! The step-by-step explanations helped me clear my campus interviews with confidence.",
    rating: 4
  },
  {
    name: "Sneha Reddy",
    role: "B.Tech CSE, Hyderabad",
    content: "I used to get stuck on errors for hours. Now, SimpleCodr translates errors into simple Hindi/English, and I fix my code in minutes!",
    rating: 3.5
  },
  {
    name: "Rahul Mehra",
    role: "Beginner Programmer, Delhi",
    content: "The project ideas and instant feedback kept me motivated. I built my first web app with the help of SimpleCodr's suggestions.",
    rating: 4.5
  }
];

