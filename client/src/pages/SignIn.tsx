import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleGuestSignIn() {
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'guest_user', password: 'guestpass' }),
      });

      if (!res.ok) throw new Error('Guest login failed');

      const { token, user } = await res.json();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (err: any) {
      setError('Could not sign in as guest');
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid login');

      const { token, user } = await res.json();

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'login failed');
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Sign In</button>
        <p className="auth-link">
          New user? <Link to="/sign-up">Create an account</Link>
        </p>
      </form>
      <button type="button" className="guest-btn" onClick={handleGuestSignIn}>
        Continue as Guest
      </button>
    </div>
  );
}
