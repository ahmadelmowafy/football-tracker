import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './MyTeam.css';

type Player = {
  id?: number;
  name: string;
  number: number;
  country: string;
  position: string;
};

export default function EditTeam() {
  const { teamId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState('');
  const [successful, setSuccessful] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`/api/teams/${teamId}/players`);
        if (!res.ok) throw new Error('Failed to load team');
        const data = await res.json();
        setTeamName(data.team.name);
        setPlayers(data.players);
      } catch (err: any) {
        setError(err.message ? err.message : 'Something went wrong');
      }
    }

    fetchTeam();
  }, [teamId]);

  function handlePlayerChange(
    index: number,
    field: keyof Player,
    value: string | number
  ) {
    const updated = [...players];
    const newValue = field === 'number' ? Number(value) : String(value);
    updated[index] = {
      ...updated[index],
      [field]: newValue,
    };
    setPlayers(updated);
  }

  function deletePlayers() {
    setPlayers([
      ...Array.from({ length: 11 }, () => ({
        name: '',
        number: 0,
        country: '',
        position: '',
      })),
    ]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName }),
      });

      for (const player of players) {
        if (player.id) {
          await fetch(`/api/players/${player.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player),
          });
        } else {
          await fetch(`/api/players`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...player, teamId }),
          });
        }
      }

      setSuccessful('Team updated successfully!');
      setError('');
      setTimeout(() => navigate(`/team/${teamId}`), 1000);
    } catch (err: any) {
      setError(err.message ? err.message : 'Something went wrong');
      setSuccessful('');
    }
  }

  return (
    <div className="my-team-container">
      <h2>Edit Team</h2>
      <button className="clear-btn" onClick={deletePlayers}>
        Clear Players
      </button>
      <form onSubmit={handleSubmit} className="team-form">
        <label>
          Team Name
          <input
            type="text"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            required
          />
        </label>

        <div className="players-section">
          <h3>Players</h3>
          {players.map((player, index) => (
            <div key={index} className="player-entry">
              <input
                type="text"
                placeholder="Name"
                value={player.name}
                onChange={(event) =>
                  handlePlayerChange(index, 'name', event.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Number"
                value={player.number}
                onChange={(event) =>
                  handlePlayerChange(index, 'number', event.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={player.country}
                onChange={(event) =>
                  handlePlayerChange(index, 'country', event.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Position"
                value={player.position}
                onChange={(event) =>
                  handlePlayerChange(index, 'position', event.target.value)
                }
                required
              />
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}
        {successful && <p className="success-msg">{successful}</p>}
        <div className="edit-actions">
          <button type="submit">Update Team</button>
          <button type="button" onClick={() => navigate(`/team/${teamId}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
