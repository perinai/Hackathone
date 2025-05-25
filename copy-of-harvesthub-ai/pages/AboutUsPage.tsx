
import React from 'react';
import Card from '../components/Card';
import { SproutIcon, LightbulbIcon } from '../components/Icons'; // Assuming you have these
import { DEFAULT_FARM_IMAGE } from '../constants';

const AboutUsPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white rounded-xl shadow-xl">
        <SproutIcon className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-5xl font-bold mb-4">Our Mission: Cultivating Connections</h1>
        <p className="text-xl max-w-3xl mx-auto">
          At HarvestHub AI, we're passionate about revolutionizing the way local food systems work, using human-centered, joy-driven technology to bridge the gap between dedicated farmers and conscious consumers.
        </p>
      </section>

      <Card>
        <h2 className="text-3xl font-semibold text-primary-dark mb-6 text-center">The Story Behind HarvestHub AI</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              HarvestHub AI was born from a simple idea: what if technology could make it easier, more joyful, and more rewarding for small-scale farmers to connect with their local communities? We saw hardworking growers struggling to reach wider markets and enthusiastic buyers finding it difficult to source truly fresh, local produce.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We envisioned a platform that wasn't just transactional, but transformational – a digital space where relationships could flourish alongside crops. A place where AI acts as a helpful guide, offering insights and simplifying processes, allowing the human element of food production and consumption to take center stage.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our journey is fueled by a deep respect for the land, the people who cultivate it, and the communities nourished by it. We're committed to building a more sustainable, equitable, and delicious future, one local connection at a time.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={DEFAULT_FARM_IMAGE} alt="Vibrant farm scene" className="w-full h-auto object-cover" />
          </div>
        </div>
      </Card>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Our Core Principles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-green-50 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
            <LightbulbIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Joy</h3>
            <p className="text-sm text-gray-600">We believe technology should spark delight and make processes enjoyable.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-500 mx-auto mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Empathy</h3>
            <p className="text-sm text-gray-600">We design with a deep understanding of our users' needs and challenges.</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-500 mx-auto mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            <h3 className="text-xl font-semibold text-yellow-700 mb-2">Trust</h3>
            <p className="text-sm text-gray-600">We foster a reliable and transparent platform for all interactions.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-500 mx-auto mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A8.966 8.966 0 012.25 12c0-1.777.782-3.374 2.09-4.502m13.66 7.218a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0012 21c-2.17 0-4.207-.576-5.963-1.584A8.966 8.966 0 002.25 12c0-1.777.782-3.374 2.09-4.502m7.5 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-9 0H3m6 0h.008v.008H9V15zm7.5-7.5h2.25M15 7.5h.008v.008H15V7.5z" /></svg>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Community</h3>
            <p className="text-sm text-gray-600">We aim to strengthen local food networks and support shared success.</p>
          </div>
        </div>
      </section>

      <Card>
        <h2 className="text-3xl font-semibold text-primary-dark mb-4 text-center">The Team Behind HarvestHub AI</h2>
        <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
          We are a diverse group of technologists, food enthusiasts, and community advocates united by a common goal: to make a positive impact on local food systems. While we may not all have dirt under our fingernails, we share a profound appreciation for the hard work of farmers and a desire to make fresh, local food more accessible to everyone. We're always learning, always listening, and always striving to make HarvestHub AI better for you.
        </p>
        {/* Optionally, add team photos or more specific details here if appropriate */}
      </Card>

    </div>
  );
};

export default AboutUsPage;
    