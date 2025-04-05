import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Matches.css';

type Match = {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
};

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMatches() {
      try {
        const userJSON = localStorage.getItem('user');
        const user = userJSON && JSON.parse(userJSON);
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

  async function handleDelete(matchId: number) {
    const confirmed = confirm('Are you sure you want to delete this match?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete match');

      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    } catch (err) {
      console.error(err);
      alert('Could not delete the match.');
    }
  }

  return (
    <div className="matches-page">
      <h2 style={{ color: '#ddd' }}>Matches</h2>
      <button
        className="add-match-button"
        onClick={() => navigate('/add-match')}>
        Add New Match
      </button>

      {matches.length === 0 && (
        <p style={{ fontSize: 22, color: '#ddd' }}>No records.</p>
      )}

      <ul className="match-list">
        {matches.map((match) => (
          <li key={match.id} className="match-item">
            <span
              className="match-title"
              onClick={() => navigate(`/matches/${match.id}`)}>
              <span className="team">{match.homeTeamName}</span>
              <span className="score">
                {match.homeScore} - {match.awayScore}
              </span>
              <span className="team">{match.awayTeamName}</span>
            </span>

            <div className="match-actions">
              <button onClick={() => navigate(`/matches/${match.id}/edit`)}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(match.id)}>🗑️ Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
