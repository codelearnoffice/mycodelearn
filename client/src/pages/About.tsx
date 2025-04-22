import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About CodeLearn
        </h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-primary to-secondary flex items-center justify-center p-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Making Programming Education Accessible to Everyone
            </h2>
          </div>
          
          <div className="p-8">
            <div className="prose prose-indigo max-w-none">
              <h3>Our Mission</h3>
              <p>
                At CodeLearn, our mission is to break down the barriers to programming education and make 
                learning to code more accessible, understandable, and enjoyable for students worldwide. 
                We believe that everyone deserves the opportunity to learn programming skills, regardless 
                of their background or resources.
              </p>
              
              <h3>Our Story</h3>
              <p>
                CodeLearn was founded in 2023 by a team of educators and engineers who were frustrated with 
                the steep learning curve and cryptic error messages that beginning programmers face. After 
                witnessing countless students struggle with understanding code concepts and debugging errors, 
                we set out to create tools that would translate the complex world of programming into 
                simple, clear language.
              </p>
              
              <h3>Our Approach</h3>
              <p>
                We take a unique approach to programming education by focusing on three key areas:
              </p>
              
              <ul>
                <li>
                  <strong>Explanation:</strong> Breaking down code into understandable concepts
                </li>
                <li>
                  <strong>Troubleshooting:</strong> Making error messages human-readable
                </li>
                <li>
                  <strong>Practice:</strong> Providing tailored project ideas to reinforce learning
                </li>
              </ul>
              
              <p>
                Our platform uses natural language processing and machine learning to analyze code, explain 
                concepts, simplify error messages, and generate personalized project ideas that match each 
                student's skill level and interests.
              </p>
              
              <h3>Our Team</h3>
              <p>
                CodeLearn is built by a diverse team of educators, engineers, and designers who are passionate 
                about programming education. Our team members have backgrounds in computer science education, 
                software engineering, user experience design, and artificial intelligence.
              </p>
              
              <h3>Our Values</h3>
              <p>
                Our work is guided by these core values:
              </p>
              
              <ul>
                <li>
                  <strong>Accessibility:</strong> Making programming education available to everyone
                </li>
                <li>
                  <strong>Clarity:</strong> Explaining complex concepts in simple, understandable terms
                </li>
                <li>
                  <strong>Empowerment:</strong> Giving students the tools and confidence to solve problems
                </li>
                <li>
                  <strong>Curiosity:</strong> Encouraging exploration and continuous learning
                </li>
                <li>
                  <strong>Inclusivity:</strong> Creating a welcoming environment for students of all backgrounds
                </li>
              </ul>
              
              <p>
                We're committed to building tools that demystify programming and help the next generation of 
                developers build the future.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}