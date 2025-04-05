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
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 11 }, () => ({
      name: '',
      number: 0,
      country: '',
      position: '',
    }))
  );
  const [error, setError] = useState('');
  const [successful, setSuccessful] = useState('');

  function fillPlayers() {
    const samplePlayers: Player[] = [
      {
        name: 'Alisson',
        number: 1,
        country: 'Brazil',
        position: 'Goalkeeper',
      },
      {
        name: 'Robertson',
        number: 26,
        country: 'Scotland',
        position: 'Defender',
      },
      {
        name: 'Virgil van Dijk',
        number: 4,
        country: 'Netherlands',
        position: 'Defender',
      },
      {
        name: 'Rúben Dias',
        number: 3,
        country: 'Portugal',
        position: 'Defender',
      },
      {
        name: 'João Cancelo',
        number: 17,
        country: 'Portugal',
        position: 'Defender',
      },
      {
        name: 'Luka Modrić',
        number: 15,
        country: 'Croatia',
        position: 'Midfielder',
      },
      {
        name: 'De Bruyne',
        number: 8,
        country: 'Belgium',
        position: 'Midfielder',
      },
      {
        name: 'Bellingham',
        number: 5,
        country: 'England',
        position: 'Midfielder',
      },
      {
        name: 'Kylian Mbappé',
        number: 7,
        country: 'France',
        position: 'Forward',
      },
      {
        name: 'Erling Haaland',
        number: 9,
        country: 'Norway',
        position: 'Forward',
      },
      {
        name: 'Lionel Messi',
        number: 10,
        country: 'Argentina',
        position: 'Forward',
      },
    ];

    setPlayers(samplePlayers);
    setTeamName('Dream XI');
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
    const userJSON = localStorage.getItem('user');
    if (!token || !userJSON) {
      setError('You must be signed in to create a team');
      return;
    }
    const user = JSON.parse(userJSON);

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
      <button className="fill-btn" onClick={fillPlayers}>
        Fill with Sample Players
      </button>
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
            </div>
          ))}
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
