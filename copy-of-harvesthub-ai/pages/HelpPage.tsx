
import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { ChevronDownIcon } from '../components/Icons'; // Assuming you have this

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left hover:text-primary focus:outline-none"
      >
        <h3 className="text-lg font-medium text-gray-800">{question}</h3>
        <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
};

const faqsForFarmers = [
  { question: "How do I list my produce?", answer: "Navigate to 'My Produce' from your dashboard and click 'Add New Produce'. Fill in the details, add photos, and set your price. Our AI assistant can even help suggest prices!" },
  { question: "How do market insights work?", answer: "The 'Market Insights' page provides AI-powered data on local price trends and demand for various produce categories, helping you make informed decisions." },
  { question: "How do I get paid?", answer: "Currently, HarvestHub AI facilitates connections. Payment terms are arranged directly between you and the buyer. Future updates may include integrated payment options." },
];

const faqsForBuyers = [
  { question: "How do I find specific produce?", answer: "Use the 'Find Produce' page (Marketplace). You can search by name, category, location, and apply various filters like 'organic'." },
  { question: "How do I contact a farmer?", answer: "On a produce detail page or farmer profile page, click the 'Contact Farmer' or 'Express Interest' button to send them a message directly through our platform." },
  { question: "Is the produce certified organic?", answer: "Farmers can tag their produce with certifications like 'organic'. Always check the listing details and feel free to ask the farmer directly for more information about their practices." },
];

const faqsAccount = [
  { question: "How do I reset my password?", answer: "On the Login page, click the 'Forgot Password?' link and follow the instructions sent to your email." },
  { question: "How do I update my profile information?", answer: "Go to your 'Account Settings' or 'My Profile' page from the user dropdown menu in the navigation bar." },
];


const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Contact form submitted:", contactForm);
    setFormSubmitted(true);
    // Reset form or show success message
  };

  // Basic search filter for FAQs (can be improved)
  const allFaqs = [...faqsForFarmers, ...faqsForBuyers, ...faqsAccount];
  const filteredFaqs = searchTerm
    ? allFaqs.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    : allFaqs;


  return (
    <div className="space-y-12">
      <section className="text-center py-10 bg-primary-light rounded-xl shadow">
        <h1 className="text-4xl font-bold text-primary-dark mb-3">Help & Support</h1>
        <p className="text-lg text-gray-700">We're here to help you make the most of HarvestHub AI.</p>
      </section>

      <Card>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <Input 
          placeholder="Search FAQs..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />
        
        {filteredFaqs.length === 0 && searchTerm && (
            <p className="text-gray-600 text-center py-4">No FAQs found matching your search term.</p>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-primary mb-3">For Farmers 🧑‍🌾</h3>
          {faqsForFarmers.filter(faq => filteredFaqs.includes(faq) || !searchTerm).map(faq => <FAQItem key={faq.question} {...faq} />)}
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-secondary mb-3">For Buyers 🛒</h3>
          {faqsForBuyers.filter(faq => filteredFaqs.includes(faq) || !searchTerm).map(faq => <FAQItem key={faq.question} {...faq} />)}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Account Management ⚙️</h3>
          {faqsAccount.filter(faq => filteredFaqs.includes(faq) || !searchTerm).map(faq => <FAQItem key={faq.question} {...faq} />)}
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Still Need Help? Contact Us</h2>
        {formSubmitted ? (
          <div className="text-center p-6 bg-green-100 text-green-700 rounded-md">
            <h3 className="text-xl font-semibold">Thank You!</h3>
            <p>Your message has been sent. Our support team will get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Your Name" name="name" value={contactForm.name} onChange={handleContactChange} required />
              <Input label="Your Email" name="email" type="email" value={contactForm.email} onChange={handleContactChange} required />
            </div>
            <Input label="Subject" name="subject" value={contactForm.subject} onChange={handleContactChange} required />
            <div className="col-span-1 md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={contactForm.message} 
                    onChange={handleContactChange} 
                    required 
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Please describe your issue or question in detail..."
                />
            </div>
            <Button type="submit" size="lg">Send Message</Button>
          </form>
        )}
        <p className="text-sm text-gray-600 mt-6 text-center">
          You can also reach us directly at <a href="mailto:support@harvesthub.ai" className="text-primary hover:underline">support@harvesthub.ai</a> or call us at (555) HHB-FARM (Mon-Fri, 9am-5pm).
        </p>
      </Card>
    </div>
  );
};

export default HelpPage;
    