import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import './AddMatch.css';

export default function EditMatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [matchDate, setMatchDate] = useState('');
  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeamName, setAwayTeamName] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeTeamPossession, setHomeTeamPossession] = useState(0);
  const [awayTeamPossession, setAwayTeamPossession] = useState(0);
  const [homeTeamShots, setHomeTeamShots] = useState(0);
  const [awayTeamShots, setAwayTeamShots] = useState(0);
  const [homeTeamShotsOnTarget, setHomeTeamShotsOnTarget] = useState(0);
  const [awayTeamShotsOnTarget, setAwayTeamShotsOnTarget] = useState(0);
  const [homeTeamFouls, setHomeTeamFouls] = useState(0);
  const [awayTeamFouls, setAwayTeamFouls] = useState(0);
  const [homeTeamCorners, setHomeTeamCorners] = useState(0);
  const [awayTeamCorners, setAwayTeamCorners] = useState(0);
  const [homeTeamOffsides, setHomeTeamOffsides] = useState(0);
  const [awayTeamOffsides, setAwayTeamOffsides] = useState(0);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`);
        if (!res.ok) throw new Error('Match not found');
        const data = await res.json();
        setMatch(data);
        setMatchDate(data.matchDate);
        setHomeTeamName(data.homeTeamName);
        setAwayTeamName(data.awayTeamName);
        setHomeScore(data.homeScore);
        setAwayScore(data.awayScore);
        setHomeTeamPossession(data.homeTeamPossession);
        setAwayTeamPossession(data.awayTeamPossession);
        setHomeTeamShots(data.homeTeamShots);
        setAwayTeamShots(data.awayTeamShots);
        setHomeTeamShotsOnTarget(data.homeTeamShotsOnTarget);
        setAwayTeamShotsOnTarget(data.awayTeamShotsOnTarget);
        setHomeTeamFouls(data.homeTeamFouls);
        setAwayTeamFouls(data.awayTeamFouls);
        setHomeTeamCorners(data.homeTeamCorners);
        setAwayTeamCorners(data.awayTeamCorners);
        setHomeTeamOffsides(data.homeTeamOffsides);
        setAwayTeamOffsides(data.awayTeamOffsides);
        populateScorers('home', data.homeScorers);
        populateScorers('away', data.awayScorers);
      } catch (err) {
        console.error(err);
        alert('Could not load match.');
      }
    }

    function populateScorers(team: string, scorersString: string) {
      const scorerInfoContainer = document.getElementById(`${team}-scorers`);

      const scorers = scorersString.split(',').map((s) => s.trim());
      scorers.forEach((scorer) => {
        const [name, minSymbol] = scorer.split(' ');
        const min = minSymbol.replace("'", '') || ''; // if scorer is null

        const scorerInfo = document.createElement('div');
        scorerInfo.className = 'scorer-info';

        const nameInput = document.createElement('input');
        nameInput.name = `${team}Scorer`;
        nameInput.placeholder = 'Scorer';
        nameInput.value = name;

        const minInput = document.createElement('input');
        minInput.name = `${team}Minute`;
        minInput.placeholder = 'min';
        minInput.value = min;

        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.className = 'remove-scorer-button';
        removeButton.onclick = () =>
          scorerInfoContainer?.removeChild(scorerInfo);

        scorerInfo.appendChild(removeButton);
        scorerInfo.appendChild(nameInput);
        scorerInfo.appendChild(minInput);

        scorerInfoContainer?.appendChild(scorerInfo);
      });
    }

    fetchMatch();
  }, [matchId]);

  function addScorer(team: string) {
    const scorerInfoContainer = document.getElementById(`${team}-scorers`);

    const scorerInfo = document.createElement('div');
    scorerInfo.className = 'scorer-info';

    const nameInput = document.createElement('input');
    nameInput.name = `${team}Scorer`;
    nameInput.placeholder = 'Scorer';
    nameInput.required = true;

    const minInput = document.createElement('input');
    minInput.name = `${team}Minute`;
    minInput.type = 'number';
    minInput.placeholder = 'min';
    minInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.textContent = '❌';
    removeButton.className = 'remove-scorer-button';
    removeButton.onclick = () => scorerInfoContainer?.removeChild(scorerInfo);

    scorerInfo.appendChild(removeButton);
    scorerInfo.appendChild(nameInput);
    scorerInfo.appendChild(minInput);

    scorerInfoContainer?.appendChild(scorerInfo);
  }

  function formatScorers(formData: FormData, team: string) {
    const names = formData.getAll(`${team}Scorer`);
    const minutes = formData.getAll(`${team}Minute`);
    const scorers: string[] = [];

    for (let i = 0; i < names.length; i++) {
      if (names[i] && minutes[i]) {
        scorers.push(`${names[i]} ${minutes[i]}'`);
      }
    }
    return scorers.join(', ');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const matchData = {
      matchDate,
      homeTeamName,
      awayTeamName,
      homeScore,
      awayScore,
      homeScorers: formatScorers(formData, 'home'),
      awayScorers: formatScorers(formData, 'away'),
      homeTeamPossession,
      awayTeamPossession,
      homeTeamShots,
      awayTeamShots,
      homeTeamShotsOnTarget,
      awayTeamShotsOnTarget,
      homeTeamFouls,
      awayTeamFouls,
      homeTeamCorners,
      awayTeamCorners,
      homeTeamOffsides,
      awayTeamOffsides,
    };

    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });

      if (!res.ok) throw new Error('Failed to update match');

      navigate(`/matches/${matchId}`);
    } catch (err) {
      alert(`Something went wrong while updating the match.\n${err}`);
    }
  }

  if (!match) return <p>Loading match...</p>;

  return (
    <div className="add-match-container">
      <h2>Edit Match</h2>
      <form onSubmit={handleSubmit} className="match-form">
        <div className="match-date-wrapper">
          <label>
            Match Date:
            <input
              type="date"
              name="matchDate"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="teams-row">
          <div className="team-box left">
            <img src={logo} alt="home team logo" className="team-logo" />
            <input
              name="homeTeam"
              placeholder="Home Team"
              value={homeTeamName}
              onChange={(e) => setHomeTeamName(e.target.value)}
              required
            />
            <div id="home-scorers" className="scorers-box" />
            <button type="button" onClick={() => addScorer('home')}>
              Add Scorer
            </button>
          </div>

          <div className="score-box">
            <input
              type="number"
              name="homeScore"
              value={homeScore}
              onChange={(e) => setHomeScore(Number(e.target.value))}
              required
            />
            <span className="dash-symbol">-</span>
            <input
              type="number"
              name="awayScore"
              value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              required
            />
          </div>

          <div className="team-box right">
            <img src={logo} alt="away team logo" className="team-logo" />
            <input
              name="awayTeam"
              placeholder="Away Team"
              value={awayTeamName}
              onChange={(e) => setAwayTeamName(e.target.value)}
              required
            />
            <div id="away-scorers" className="scorers-box" />
            <button type="button" onClick={() => addScorer('away')}>
              Add Scorer
            </button>
          </div>
        </div>

        <div className="match-stats-3col">
          <div className="stat-row">
            <input
              type="number"
              name="homeTeamPossession"
              value={homeTeamPossession}
              onChange={(e) => setHomeTeamPossession(Number(e.target.value))}
              required
            />
            <label>Possession</label>
            <input
              type="number"
              name="awayTeamPossession"
              value={awayTeamPossession}
              onChange={(e) => setAwayTeamPossession(Number(e.target.value))}
              required
            />
          </div>

          <div className="stat-row">
            <input
              type="number"
              name="homeTeamShots"
              value={homeTeamShots}
              onChange={(e) => setHomeTeamShots(Number(e.target.value))}
              required
            />
            <label>Shots</label>
            <input
              type="number"
              name="awayTeamShots"
              value={awayTeamShots}
              onChange={(e) => setAwayTeamShots(Number(e.target.value))}
              required
            />
          </div>

          <div className="stat-row">
            <input
              type="number"
              name="homeTeamShotsOnTarget"
              value={homeTeamShotsOnTarget}
              onChange={(e) => setHomeTeamShotsOnTarget(Number(e.target.value))}
              required
            />
            <label>Shots on Target</label>
            <input
              type="number"
              name="awayTeamShotsOnTarget"
              value={awayTeamShotsOnTarget}
              onChange={(e) => setAwayTeamShotsOnTarget(Number(e.target.value))}
              required
            />
          </div>

          <div className="stat-row">
            <input
              type="number"
              name="homeTeamFouls"
              value={homeTeamFouls}
              onChange={(e) => setHomeTeamFouls(Number(e.target.value))}
              required
            />
            <label>Fouls</label>
            <input
              type="number"
              name="awayTeamFouls"
              value={awayTeamFouls}
              onChange={(e) => setAwayTeamFouls(Number(e.target.value))}
              required
            />
          </div>

          <div className="stat-row">
            <input
              type="number"
              name="homeTeamCorners"
              value={homeTeamCorners}
              onChange={(e) => setHomeTeamCorners(Number(e.target.value))}
              required
            />
            <label>Corners</label>
            <input
              type="number"
              name="awayTeamCorners"
              value={awayTeamCorners}
              onChange={(e) => setAwayTeamCorners(Number(e.target.value))}
              required
            />
          </div>

          <div className="stat-row">
            <input
              type="number"
              name="homeTeamOffsides"
              value={homeTeamOffsides}
              onChange={(e) => setHomeTeamOffsides(Number(e.target.value))}
              required
            />
            <label>Offsides</label>
            <input
              type="number"
              name="awayTeamOffsides"
              value={awayTeamOffsides}
              onChange={(e) => setAwayTeamOffsides(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="btn-container">
          <button type="submit" className="save-btn">
            Update
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/matches')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
