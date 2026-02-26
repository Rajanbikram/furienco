import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, signupSchema } from './schema/authSchema';
import '../../css/auth.css';

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSignup = (data) => {
    console.log('Signup Data:', data);
    // API call here
  };

  const onLogin = (data) => {
    console.log('Login Data:', data);
    // API call here
  };

  return (
    <div className="auth-page">
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSubmitSignup(onSignup)}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            
            <input
              type="text"
              placeholder="Name"
              {...registerSignup('name')}
            />
            {errorsSignup.name && (
              <span className="error">{errorsSignup.name.message}</span>
            )}

            <input
              type="email"
              placeholder="Email"
              {...registerSignup('email')}
            />
            {errorsSignup.email && (
              <span className="error">{errorsSignup.email.message}</span>
            )}

            <input
              type="password"
              placeholder="Password"
              {...registerSignup('password')}
            />
            {errorsSignup.password && (
              <span className="error">{errorsSignup.password.message}</span>
            )}

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSubmitLogin(onLogin)}>
            <h1>Sign In</h1>
            <span>Use your email and password</span>

            <input
              type="email"
              placeholder="Email"
              {...registerLogin('email')}
            />
            {errorsLogin.email && (
              <span className="error">{errorsLogin.email.message}</span>
            )}

            <input
              type="password"
              placeholder="Password"
              {...registerLogin('password')}
            />
            {errorsLogin.password && (
              <span className="error">{errorsLogin.password.message}</span>
            )}

            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                className="hidden"
                type="button"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button
                className="hidden"
                type="button"
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;