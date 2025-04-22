import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import FeatureCard from "@/components/FeatureCard";
import HowItWorksStep from "@/components/HowItWorksStep";
import TestimonialCard from "@/components/TestimonialCard";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import { features, steps, testimonials, pricingPlans } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    // This would normally send the data to a server
    toast({
      title: "Thanks for signing up!",
      description: "We'll be in touch soon.",
    });
    
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Understand Code, Fix Errors, Build Projects
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-300">
                The all-in-one platform that explains your code line by line, translates errors into plain English, and generates project ideas for students.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  Try For Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                >
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <CodeBlock />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Powerful Tools for Learning to Code
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform offers three specialized tools designed to accelerate your coding journey and make learning programming concepts easier than ever.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies the coding learning process with just a few easy steps
            </p>
          </div>
          
          <div className="mt-12 relative">
            {/* Connected line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Steps */}
            <div className="space-y-12 relative">
              {steps.map((step, index) => (
                <HowItWorksStep 
                  key={index} 
                  {...step} 
                  isEven={index % 2 === 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              What Students Say
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who are accelerating their coding journey with CodeBuddy
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Simple, Flexible Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Start for free and upgrade as your needs grow
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="gradient-bg text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Start Your Coding Journey Today
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of students who are learning to code faster and more effectively
          </p>
          
          <div className="mt-8">
            <form 
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
              onSubmit={handleSignup}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="px-6 py-3 bg-secondary text-white font-medium rounded-md hover:bg-secondary/90"
              >
                Get Early Access
              </Button>
            </form>
            <p className="mt-3 text-sm text-gray-300">
              No credit card required. Start with a free account.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
