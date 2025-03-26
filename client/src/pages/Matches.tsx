import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Matches.css';

type Match = {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
};

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMatches() {
      try {
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        if (!user) {
          alert('You must be signed in to view your matches.');
          return;
        }
        const res = await fetch(`/api/users/${user.id}/matches`);
        if (!res.ok) throw new Error('Failed to fetch matches');
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
        alert('Error fetching matches.');
      }
    }

    fetchMatches();
  }, []);

  return (
    <div className="matches-page">
      <h2>Matches</h2>
      <button
        className="add-match-button"
        onClick={() => navigate('/add-match')}>
        Add New Match
      </button>

      <ul className="match-list">
        {matches.map((match) => (
          <li
            key={match.id}
            className="match-item"
            onClick={() => navigate(`/matches/${match.id}`)}>
            {match.homeTeamName} vs. {match.awayTeamName}
          </li>
        ))}
      </ul>
    </div>
  );
}
