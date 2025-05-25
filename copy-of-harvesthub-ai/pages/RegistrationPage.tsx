
import React, { useState, useEffect } from 'react';
// Fix: Import Link from react-router-dom
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, User } from '../types';
import { ROUTES } from '../constants';
import Input, { Textarea } from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading, user: authUser } = useAuth();
  
  const [role, setRole] = useState<UserRole>( (location.state as {role: UserRole})?.role || UserRole.BUYER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '', // Zip or City, State
    farmName: '', // Farmer
    farmDescription: '', // Farmer
    businessName: '', // Buyer
    businessType: '', // Buyer
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      navigate(authUser.role === UserRole.FARMER ? ROUTES.FARMER_DASHBOARD : ROUTES.BUYER_DASHBOARD);
    }
  }, [authUser, navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const userData: Omit<User, 'id' | 'createdAt'> = {
      name: formData.name,
      email: formData.email,
      role: role,
      // password is not part of User type, handled by auth service
      location: formData.location,
      farmName: role === UserRole.FARMER ? formData.farmName : undefined,
      farmDescription: role === UserRole.FARMER ? formData.farmDescription : undefined,
      businessName: role === UserRole.BUYER ? formData.businessName : undefined,
      businessType: role === UserRole.BUYER ? formData.businessType : undefined,
      profilePictureUrl: `https://picsum.photos/seed/${formData.email}/200/200`, // default
    };

    try {
      // The actual register function should handle the password separately
      // For this demo, the mock register in AuthContext doesn't use password but would in real app
      const registeredUser = await register(userData); 
      if (registeredUser) {
        setSuccess(`Welcome, ${registeredUser.name}! Registration successful. Redirecting...`);
        setTimeout(() => {
          if (registeredUser.role === UserRole.FARMER) {
            navigate(ROUTES.FARMER_DASHBOARD);
          } else {
            navigate(ROUTES.BUYER_DASHBOARD);
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };
  
  const toggleRole = (newRole: UserRole) => {
    setRole(newRole);
    // Optionally clear role-specific fields or handle migration if needed
    setFormData(prev => ({
        ...prev,
        farmName: newRole === UserRole.FARMER ? prev.farmName : '',
        farmDescription: newRole === UserRole.FARMER ? prev.farmDescription : '',
        businessName: newRole === UserRole.BUYER ? prev.businessName : '',
        businessType: newRole === UserRole.BUYER ? prev.businessType : '',
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card title={`Join HarvestHub AI as a ${role === UserRole.FARMER ? 'Farmer' : 'Buyer'}`}>
        <div className="mb-6 flex justify-center space-x-4">
            <Button 
                variant={role === UserRole.FARMER ? 'primary' : 'outline'}
                onClick={() => toggleRole(UserRole.FARMER)}
                className="flex-1"
            >
                I'm a Farmer <span role="img" aria-label="Farmer" className="ml-1">🧑‍🌾</span>
            </Button>
            <Button 
                variant={role === UserRole.BUYER ? 'primary' : 'outline'}
                onClick={() => toggleRole(UserRole.BUYER)}
                className="flex-1"
            >
                I'm a Buyer <span role="img" aria-label="Buyer" className="ml-1">🛒</span>
            </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
          <Input label="Location (e.g., City, State or Zip Code)" name="location" value={formData.location} onChange={handleChange} required />

          {role === UserRole.FARMER && (
            <>
              <Input label="Farm Name (Optional)" name="farmName" value={formData.farmName} onChange={handleChange} />
              <Textarea label="Brief Farm Description/Specialty (Optional)" name="farmDescription" value={formData.farmDescription} onChange={handleChange} placeholder="Share a little about your farm's magic!" />
            </>
          )}

          {role === UserRole.BUYER && (
            <>
              <Input label="Business Name (e.g., Restaurant, Market, Co-op)" name="businessName" value={formData.businessName} onChange={handleChange} required/>
              <Input label="Business Type (e.g., Restaurant, Grocery, Individual)" name="businessType" value={formData.businessType} onChange={handleChange} />
            </>
          )}
          
          <p className="text-xs text-gray-500">By creating an account, you agree to our <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.</p>

          <Button type="submit" isLoading={loading} fullWidth size="lg">
            {role === UserRole.FARMER ? "Create My Farm Account" : "Find Fresh Ingredients!"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:text-primary-dark">
            Log in here
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-gray-500">
            "Let's get you started on a fruitful journey!" <span role="img" aria-label="sprout">🌱</span>
        </p>
      </Card>
    </div>
  );
};

export default RegistrationPage;