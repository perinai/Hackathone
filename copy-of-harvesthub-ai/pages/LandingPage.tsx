
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, DEFAULT_FARM_IMAGE } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import { SproutIcon, LightbulbIcon } from '../components/Icons';

// Fix: Change icon prop type to React.ReactElement for proper cloning and specify it can take className.
interface FeatureCardProps { title: string; description: string; icon: React.ReactElement<{ className?: string }>; }

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <Card className="text-center transform transition-all duration-300 hover:scale-105 h-full">
    {/* Fix: Pass className to cloned icon element */}
    <div className="flex justify-center text-primary mb-4">{React.cloneElement(icon, { className: "w-16 h-16" })}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </Card>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 bg-gradient-to-br from-primary-light via-primary to-primary-dark rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="https://picsum.photos/seed/harvestbg/1600/900" alt="Lush farm background" className="w-full h-full object-cover"/>
        </div>
        <div className="relative container mx-auto px-6">
          <SproutIcon className="w-24 h-24 text-white mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            HarvestHub AI: Connecting Growers, Nourishing Communities.
          </h1>
          <p className="text-xl md:text-2xl text-white mb-10 drop-shadow-md">
            Freshness finds its way. Joyfully.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-6">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate(ROUTES.REGISTER, { state: { role: 'farmer'}})}
              className="transform transition-transform duration-200 hover:scale-105"
            >
              I'm a Farmer, Let's Grow! <span role="img" aria-label="seedling" className="ml-2">🌱</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-primary transform transition-transform duration-200 hover:scale-105"
              onClick={() => navigate(ROUTES.REGISTER, { state: { role: 'buyer'}})}
            >
              I'm a Buyer, Discover Local! <span role="img" aria-label="shopping basket" className="ml-2">🧺</span>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section>
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-12">How HarvestHub AI Works</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <Card className="bg-green-50">
            <h3 className="text-2xl font-semibold text-primary-dark mb-4">For Farmers <span role="img" aria-label="farmer emoji" className="ml-2">🧑‍🌾</span></h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start"><SproutIcon className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" /> Easily list your fresh produce with AI-powered suggestions.</li>
              <li className="flex items-start"><SproutIcon className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" /> Get market insights to price competitively and understand demand.</li>
              <li className="flex items-start"><SproutIcon className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" /> Connect directly with local buyers looking for your harvest.</li>
              <li className="flex items-start"><SproutIcon className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" /> Build your farm's reputation and reach a wider audience.</li>
            </ul>
          </Card>
          <Card className="bg-amber-50">
            <h3 className="text-2xl font-semibold text-secondary-dark mb-4">For Buyers <span role="img" aria-label="shopping cart emoji" className="ml-2">🛒</span></h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start"><LightbulbIcon className="w-5 h-5 text-secondary mr-2 mt-1 shrink-0" /> Discover a wide variety of fresh, local produce from nearby farms.</li>
              <li className="flex items-start"><LightbulbIcon className="w-5 h-5 text-secondary mr-2 mt-1 shrink-0" /> Search and filter by category, location, certifications, and more.</li>
              <li className="flex items-start"><LightbulbIcon className="w-5 h-5 text-secondary mr-2 mt-1 shrink-0" /> Connect directly with farmers to learn about their practices and arrange purchases.</li>
              <li className="flex items-start"><LightbulbIcon className="w-5 h-5 text-secondary mr-2 mt-1 shrink-0" /> Support local agriculture and enjoy the freshest ingredients.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="bg-white py-16 rounded-lg shadow-lg">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-12">Why Choose HarvestHub AI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Ease of Use" 
              description="Our platform is designed for simplicity. Listing and finding produce is intuitive and quick, with AI assistance along the way."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
            />
            <FeatureCard 
              title="Fair & Transparent" 
              description="We believe in fair prices for farmers and clear information for buyers. AI insights help ensure market fairness."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <FeatureCard 
              title="Local Connections" 
              description="Strengthen your community by connecting directly with local growers and consumers. Taste the difference of local!"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A8.966 8.966 0 012.25 12c0-1.777.782-3.374 2.09-4.502m13.66 7.218a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0012 21c-2.17 0-4.207-.576-5.963-1.584A8.966 8.966 0 002.25 12c0-1.777.782-3.374 2.09-4.502m7.5 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-9 0H3m6 0h.008v.008H9V15zm7.5-7.5h2.25M15 7.5h.008v.008H15V7.5z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* Social Proof (Illustrative) */}
      <section>
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-12">Voices from Our Community</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <Card className="bg-green-50">
            <div className="flex items-center mb-4">
              <img src="https://picsum.photos/seed/farmertestimonial/50/50" alt="Farmer testimonial" className="w-12 h-12 rounded-full mr-4"/>
              <div>
                <p className="font-semibold text-primary-dark">Sarah M. - Green Acres Farm</p>
                <p className="text-sm text-gray-500">Farmer</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"HarvestHub AI has been a game-changer! I've connected with so many new local customers, and the market insights are incredibly helpful for pricing. Listing produce is a breeze."</p>
          </Card>
          <Card className="bg-amber-50">
            <div className="flex items-center mb-4">
              <img src="https://picsum.photos/seed/buyertestimonial/50/50" alt="Buyer testimonial" className="w-12 h-12 rounded-full mr-4"/>
              <div>
                <p className="font-semibold text-secondary-dark">David L. - The Rustic Spoon Cafe</p>
                <p className="text-sm text-gray-500">Restaurant Owner</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"Finding fresh, local ingredients used to be time-consuming. Now, with HarvestHub AI, I can easily discover amazing produce from nearby farms. The quality is outstanding, and I love supporting local growers."</p>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-16 bg-primary-light rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-primary-dark mb-6">Ready to Join the Harvest?</h2>
        <p className="text-lg text-gray-700 mb-8">Become a part of our growing community dedicated to fresh food and local connections.</p>
        <div className="space-x-4">
          <Button size="lg" variant="primary" onClick={() => navigate(ROUTES.REGISTER)}>Get Started Today</Button>
          <Button size="lg" variant="ghost" onClick={() => navigate(ROUTES.ABOUT_US)}>Learn More About Our Mission</Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
