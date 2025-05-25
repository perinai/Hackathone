
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/Button';
import { SproutIcon } from '../components/Icons'; // Assuming SproutIcon is available

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <SproutIcon className="w-24 h-24 text-primary-light mb-8 animate-bounce" />
      <h1 className="text-6xl font-bold text-primary-dark mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Oops! Page Not Found.</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        It seems the page you're looking for has sprouted elsewhere or doesn't exist.
        Don't worry, let's get you back on track to fresh discoveries!
      </p>
      <div className="space-x-4">
        <Link to={ROUTES.LANDING}>
          <Button size="lg" variant="primary">
            Go to Homepage
          </Button>
        </Link>
        <Link to={ROUTES.MARKETPLACE}>
          <Button size="lg" variant="outline">
            Browse Produce
          </Button>
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-12">
        If you believe this is an error, please feel free to <Link to={ROUTES.HELP} className="text-primary hover:underline">contact support</Link>.
      </p>
    </div>
  );
};

export default NotFoundPage;
