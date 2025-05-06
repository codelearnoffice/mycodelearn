import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import FeatureCard from "@/components/FeatureCard";
import HowItWorksStep from "@/components/HowItWorksStep";
import TestimonialCard from "@/components/TestimonialCard";
import SimpleFeedbackForm from "@/components/SimpleFeedbackForm";
import Footer from "@/components/Footer";
import { features, steps, testimonials } from "@/lib/utils";
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
      <section className="gradient-bg text-white pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <ul>Coding</ul> Made Simple for <i className="italic font-normal text-[35px]">Everyone</i>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-300">
                The all-in-one platform that offers line by line code explanation, translates error messages into plain English, and generates project ideas for students and beginners.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  <a href="/auth">Start Coding</a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                >
                  <a href="#features">Explore our features</a>
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
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Learn Coding with us... our features
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Master programming with line-by-line code explanations, plain-English error fixes, and tailored project ideas for students. Perfect for learning Python, JavaScript, Java, and C++ with hands-on coding projects and real-time collaboration            </p>
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
              How to Code: Interactive Learning Process for Beginners
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our educational coding platform simplifies learning programming with interactive tutorials, line-by-line code explanation, and debugging assistance for Python, JavaScript, Java, and C++
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Our Student's Success stories...
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who are accelerating their coding journey with with hands-on coding projects, and debugging assistance for Productive learning
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      

      
      {/* CTA Section */}
      <section className="gradient-bg text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Start Your Coding Journey here with us
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of students who are learning to code faster and more effectively with our beginner-friendly programming tutorials, interactive coding platform, and project-based learning approach
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
                Start Coding with us
              </Button>
            </form>
            <p className="mt-3 text-sm text-gray-300">
              No credit card required. Start with a free account.
            </p>
          </div>
        </div>
      </section>
      
      {/* Feedback Section */}
      <section className="bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Share Your Experience with Our Coding Tutorials
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Help us improve our features/services by sharing your thoughts on our educational coding platform, interactive learning tools, and programming project ideas
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center">
  <a href="https://forms.gle/puwEJj68p2mMGynZ7" target="_blank" rel="noopener noreferrer">
    <Button className="bg-secondary text-white hover:bg-secondary/90" size="lg">
      Give Feedback
    </Button>
  </a>
</div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
