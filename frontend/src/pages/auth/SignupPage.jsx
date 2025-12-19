import React from 'react';
import SignupForm from '../../components/auth/SignupForm';
import './AuthPage.css';

const SignupPage = () => {
  return (
    <div className="auth-page">
      <SignupForm />
    </div>
  );
};

export default SignupPage;