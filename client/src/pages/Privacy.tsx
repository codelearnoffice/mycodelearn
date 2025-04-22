import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="prose prose-indigo max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Last Updated: April 15, 2025
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to CodeLearn ("we," "our," or "us"). We are committed to protecting your privacy 
              and handling your data with transparency and care. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul>
              <li>Create an account (name, email address, username, password)</li>
              <li>Use our services (code submissions, error messages)</li>
              <li>Complete forms (contact information, professional background)</li>
              <li>Participate in surveys or promotions</li>
              <li>Contact customer support</li>
            </ul>
            
            <h3>2.2 Usage Information</h3>
            <p>
              We automatically collect certain information about your device and how you interact with our platform:
            </p>
            <ul>
              <li>Log data (IP address, browser type, pages visited, time spent)</li>
              <li>Device information (hardware model, operating system)</li>
              <li>Feature usage patterns</li>
              <li>Performance data</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the collected information for various purposes, including to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Personalize your experience</li>
              <li>Send administrative information</li>
              <li>Respond to your requests and support needs</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Monitor usage patterns and conduct analytics</li>
              <li>Ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>4. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined 
              in this Privacy Policy, unless a longer retention period is required or permitted by law. When 
              we no longer need your data, we will securely delete or anonymize it.
            </p>
            
            <h2>5. How We Share Your Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Service providers who help us deliver our services</li>
              <li>Business partners (with your consent)</li>
              <li>Legal and regulatory authorities when required by law</li>
              <li>Potential buyers in case of a merger, acquisition, or sale of assets</li>
            </ul>
            
            <h2>6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul>
              <li>Access and receive a copy of your data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in Section 10.
            </p>
            
            <h2>7. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the Internet or electronic storage is 100% secure, and we 
              cannot guarantee absolute security.
            </p>
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected information from 
              a child under 13, please contact us, and we will promptly remove such information.
            </p>
            
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by 
              an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our privacy practices, 
              please contact us at:
            </p>
            <p>
              CodeLearn<br />
              123 Tech Avenue<br />
              San Francisco, CA 94103<br />
              Email: privacy@codelearn.com
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}