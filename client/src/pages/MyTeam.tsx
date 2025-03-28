import { useState, FormEvent } from 'react';
import './MyTeam.css';

type Player = {
  name: string;
  number: number;
  country: string;
  position: string;
};

export default function MyTeam() {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState('');
  const [successful, setSuccessful] = useState('');

  function handleAddPlayer() {
    if (players.length >= 11) {
      setError('You can only add up to 11 players');
      return;
    }
    setPlayers([
      ...players,
      { name: '', number: 0, country: '', position: '' },
    ]);
    setError('');
  }

  function handleRemovePlayer(index: number) {
    setPlayers(players.filter((_, i) => i !== index));
  }

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (!token || !userJson) {
      setError('You must be signed in to create a team');
      return;
    }
    const user = JSON.parse(userJson);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, name: teamName }),
      });

      if (!res.ok) throw new Error('Failed to create team');

      const team = await res.json();

      for (const player of players) {
        await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId: team.id, ...player }),
        });
      }

      setSuccessful('Team created successfully');
      setError('');
      setTeamName('');
      setPlayers([]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSuccessful('');
    }
  }

  return (
    <div className="my-team-container">
      <h2>Create Your Team</h2>
      <form onSubmit={handleSubmit} className="team-form">
        <label className="team-name">
          Team Name
          <input
            type="text"
            className="team-name-input"
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
              <button type="button" onClick={() => handleRemovePlayer(index)}>
                Delete
              </button>
            </div>
          ))}

          <button type="button" onClick={handleAddPlayer}>
            Add Player
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {successful && <p className="success-msg">{successful}</p>}
        <button type="submit" disabled={players.length === 0}>
          Create Team
        </button>
      </form>
    </div>
  );
}
