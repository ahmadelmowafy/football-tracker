import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamView.css';

type Player = {
  id: number;
  name: string;
  number: number;
  country: string;
  position: string;
};

type Team = {
  id: number;
  name: string;
  userId: number;
};

export default function TeamView() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = team?.id === user.id;

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`/api/teams/${teamId}/players`);
        if (!res.ok) throw new Error('Failed to load team');

        const data = await res.json();

        setTeam(data.team);
        setPlayers(data.players);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeam();
  }, [teamId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  const goalkeeper = players.filter((player) =>
    player.position.toLowerCase().includes('goalkeeper')
  );
  const defenders = players.filter((player) =>
    player.position.toLowerCase().includes('defender')
  );
  const midfielders = players.filter((player) =>
    player.position.toLowerCase().includes('midfielder')
  );
  const forwards = players.filter((player) =>
    player.position.toLowerCase().includes('forward')
  );

  function renderPlayer(player: Player) {
    return (
      <div key={player.id} className="player-card">
        <p className="player-name">{player.name}</p>
        <p className="player-number">#{player.number}</p>
        <p className="player-country">{player.country}</p>
      </div>
    );
  }

  return (
    <div className="my-team-container">
      <h2>{team?.name}</h2>
      {isOwner && (
        <button
          onClick={() => navigate(`/team/${team?.id}/edit`)}
          className="edit-button">
          Edit Team
        </button>
      )}
      <div className="formation-container">
        <div className="formation-row">{forwards.map(renderPlayer)}</div>
        <div className="formation-row">{midfielders.map(renderPlayer)}</div>
        <div className="formation-row">{defenders.map(renderPlayer)}</div>
        <div className="formation-row">{goalkeeper.map(renderPlayer)}</div>
      </div>
    </div>
  );
}
