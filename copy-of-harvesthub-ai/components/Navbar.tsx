
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ROUTES } from '../constants';
import { SproutIcon, BellIcon, UserCircleIcon, LogoutIcon, ChevronDownIcon, ChatBubbleLeftEllipsisIcon } from './Icons';
import Button from './Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = 5; // Mock
  const unreadMessages = 2; // Mock

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate(ROUTES.LANDING);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('#mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commonLinks = [
    { name: 'About Us', path: ROUTES.ABOUT_US },
    { name: 'Help & FAQ', path: ROUTES.HELP },
  ];
  
  let roleSpecificLinks: { name: string; path: string }[] = [];
  if (user) {
    if (user.role === UserRole.FARMER) {
      roleSpecificLinks = [
        { name: 'Dashboard', path: ROUTES.FARMER_DASHBOARD },
        { name: 'My Produce', path: ROUTES.MY_PRODUCE },
        { name: 'Market Insights', path: ROUTES.FARMER_MARKET_INSIGHTS },
      ];
    } else if (user.role === UserRole.BUYER) {
      roleSpecificLinks = [
        { name: 'Dashboard', path: ROUTES.BUYER_DASHBOARD },
        { name: 'Find Produce', path: ROUTES.MARKETPLACE },
        { name: 'My Farmers', path: ROUTES.BUYER_CONNECTIONS },
      ];
    }
  } else {
     roleSpecificLinks = [ { name: 'Browse Produce', path: ROUTES.MARKETPLACE }];
  }

  const navLinks = [...roleSpecificLinks, ...commonLinks];


  const renderNavLink = (link: { name: string, path: string }, mobile: boolean = false) => (
    <Link
      key={link.name}
      to={link.path}
      onClick={() => mobile && setMobileMenuOpen(false)}
      className={`px-3 py-2 rounded-md text-sm font-medium ${mobile ? 'block hover:bg-primary-light hover:text-primary-dark' : 'hover:bg-primary-dark hover:text-white'}`}
    >
      {link.name}
    </Link>
  );

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={user ? (user.role === UserRole.FARMER ? ROUTES.FARMER_DASHBOARD : ROUTES.BUYER_DASHBOARD) : ROUTES.LANDING} className="flex items-center space-x-2 text-white">
            <SproutIcon className="h-10 w-10 text-white" />
            <span className="font-bold text-2xl">HarvestHub AI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 text-white">
            {navLinks.map(link => renderNavLink(link))}
          </div>

          {/* Right side: Icons and Profile/Login */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to={ROUTES.NOTIFICATIONS} className="relative text-white hover:text-secondary-light">
                  <BellIcon className="h-7 w-7" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                <Link to={ROUTES.MESSAGES} className="relative text-white hover:text-secondary-light">
                  <ChatBubbleLeftEllipsisIcon className="h-7 w-7" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center text-white hover:text-secondary-light focus:outline-none"
                  >
                    <UserCircleIcon className="h-8 w-8 rounded-full" />
                    <span className="ml-2 text-sm font-medium hidden lg:block">{user.name}</span>
                    <ChevronDownIcon className="ml-1 h-5 w-5" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1 z-20 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm text-gray-700">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <Link to={ROUTES.PROFILE} onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">My Profile</Link>
                      {user.role === UserRole.FARMER && <Link to={ROUTES.FARMER_PROFILE + `/${user.id}`} onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">My Public Farm Profile</Link>}
                      <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                        <LogoutIcon className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Button onClick={() => navigate(ROUTES.LOGIN)} variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary">Login</Button>
                <Button onClick={() => navigate(ROUTES.REGISTER)} variant="secondary" size="sm">Sign Up</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             {user && (
                <div className="flex items-center space-x-4 mr-2">
                    <Link to={ROUTES.NOTIFICATIONS} className="relative text-white hover:text-secondary-light">
                        <BellIcon className="h-6 w-6" />
                        {unreadNotifications > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{unreadNotifications}</span>}
                    </Link>
                    <Link to={ROUTES.MESSAGES} className="relative text-white hover:text-secondary-light">
                        <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
                        {unreadMessages > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{unreadMessages}</span>}
                    </Link>
                </div>
             )}
            <button
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-secondary-light focus:outline-none"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-primary-dark text-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => renderNavLink(link, true))}
            {user ? (
              <>
                <Link to={ROUTES.PROFILE} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-light hover:text-primary-dark">My Profile</Link>
                 {user.role === UserRole.FARMER && <Link to={ROUTES.FARMER_PROFILE + `/${user.id}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-light hover:text-primary-dark">My Public Farm Profile</Link>}
                <button onClick={() => {handleLogout(); setMobileMenuOpen(false);}} className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 hover:text-white">
                  <LogoutIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button onClick={() => { navigate(ROUTES.LOGIN); setMobileMenuOpen(false); }} variant="outline" size="sm" fullWidth className="mt-2 text-white border-white hover:bg-white hover:text-primary">Login</Button>
                <Button onClick={() => { navigate(ROUTES.REGISTER); setMobileMenuOpen(false);}} variant="secondary" size="sm" fullWidth className="mt-2">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
    