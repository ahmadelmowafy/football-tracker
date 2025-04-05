import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  function handleSignOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  }

  async function handleMyTeamClick() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert('You must be signed in to view your team');
      return;
    }

    const user = JSON.parse(userJson);

    try {
      const res = await fetch(`/api/user/${user.id}/team`);
      if (!res.ok) {
        return navigate('/create-team');
      }

      const team = await res.json();
      navigate(`/team/${team.id}`);
    } catch (err) {
      console.error('Error checking for team:', err);
      alert('Something went wrong while checking your team');
    }
  }

  async function handleMatchesClick() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert('You must be signed in to view your saved matches');
      return;
    }

    const user = JSON.parse(userJson);

    try {
      const res = await fetch(`/api/users/${user.id}/matches`);
      if (!res.ok) {
        throw new Error('an unexpected error occurred');
      }
      navigate(`/matches`);
    } catch (err) {
      console.error('Error viewing matches:', err);
      alert('Error viewing matches');
    }
  }

  return (
    <nav className="navbar">
      <ul className="nav-list nav-left">
        <li>
          <Link to="/" className="nav-link">
            Football Tracker
          </Link>
        </li>
        <li>
          <button onClick={handleMyTeamClick} className="nav-link">
            My Team
          </button>
        </li>
        <li>
          <button onClick={handleMatchesClick} className="nav-link">
            Matches
          </button>
        </li>
      </ul>

      <ul className="nav-list nav-right">
        <li className="auth-link">
          {isLoggedIn ? (
            <button onClick={handleSignOut} className="signout-link">
              Sign Out
            </button>
          ) : (
            <Link to="/sign-in" className="nav-link">
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
