import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './AddMatch.css';

export default function AddMatch() {
  const navigate = useNavigate();

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
    const scorers = [];

    for (let i = 0; i < names.length; i++) {
      if (names[i] && minutes[i]) {
        scorers.push(`${names[i]} ${minutes[i]}'`);
      }
    }
    const allScorers = scorers.join(', ');
    return allScorers;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form as HTMLFormElement);

    const userJson = localStorage.getItem('user');
    const user = userJson && JSON.parse(userJson);

    const matchData = {
      userId: user?.id,
      matchDate: formData.get('matchDate'),
      homeTeamName: formData.get('homeTeam'),
      awayTeamName: formData.get('awayTeam'),
      homeScore: formData.get('homeScore'),
      awayScore: formData.get('awayScore'),
      homeScorers: formatScorers(formData, 'home'),
      awayScorers: formatScorers(formData, 'away'),
      homeTeamPossession: formData.get('homeTeamPossession'),
      awayTeamPossession: formData.get('awayTeamPossession'),
      homeTeamShots: formData.get('homeTeamShots'),
      awayTeamShots: formData.get('awayTeamShots'),
      homeTeamShotsOnTarget: formData.get('homeTeamShotsOnTarget'),
      awayTeamShotsOnTarget: formData.get('awayTeamShotsOnTarget'),
      homeTeamFouls: formData.get('homeTeamFouls'),
      awayTeamFouls: formData.get('awayTeamFouls'),
      homeTeamCorners: formData.get('homeTeamCorners'),
      awayTeamCorners: formData.get('awayTeamCorners'),
      homeTeamOffsides: formData.get('homeTeamOffsides'),
      awayTeamOffsides: formData.get('awayTeamOffsides'),
    };

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });

      if (!res.ok) throw new Error('Failed to save match');

      const createdMatch = await res.json();
      navigate(`/matches/${createdMatch.id}`);
    } catch (err) {
      alert(`Something went wrong while saving the match.\n${err}`);
    }
  }

  return (
    <div className="add-match-container">
      <h2>Add New Match</h2>
      <form onSubmit={handleSubmit} className="match-form">
        <div className="match-date-wrapper">
          <label>
            Match Date:
            <input type="date" name="matchDate" required />
          </label>
        </div>
        <div className="teams-row">
          <div className="team-box left">
            <img src={logo} alt="home team logo" className="team-logo" />
            <input name="homeTeam" placeholder="Home Team" required />
            <div id="home-scorers" className="scorers-box" />
            <button type="button" onClick={() => addScorer('home')}>
              Add Scorer
            </button>
          </div>

          <div className="score-box">
            <input type="number" name="homeScore" placeholder="0" required />
            <span className="dash-symbol">-</span>
            <input type="number" name="awayScore" placeholder="0" required />
          </div>

          <div className="team-box right">
            <img src={logo} alt="away team logo" className="team-logo" />
            <input name="awayTeam" placeholder="Away Team" required />
            <div id="away-scorers" className="scorers-box" />
            <button type="button" onClick={() => addScorer('away')}>
              Add Scorer
            </button>
          </div>
        </div>

        <div className="match-stats-3col">
          <div className="stat-row">
            <input name="homeTeamPossession" type="number" required />
            <label>Possession</label>
            <input name="awayTeamPossession" type="number" required />
          </div>

          <div className="stat-row">
            <input name="homeTeamShots" type="number" required />
            <label>Shots</label>
            <input name="awayTeamShots" type="number" required />
          </div>

          <div className="stat-row">
            <input name="homeTeamShotsOnTarget" type="number" required />
            <label>Shots on Target</label>
            <input name="awayTeamShotsOnTarget" type="number" required />
          </div>

          <div className="stat-row">
            <input name="homeTeamFouls" type="number" required />
            <label>Fouls</label>
            <input name="awayTeamFouls" type="number" required />
          </div>

          <div className="stat-row">
            <input name="homeTeamCorners" type="number" required />
            <label>Corners</label>
            <input name="awayTeamCorners" type="number" required />
          </div>

          <div className="stat-row">
            <input name="homeTeamOffsides" type="number" required />
            <label>Offsides</label>
            <input name="awayTeamOffsides" type="number" required />
          </div>
        </div>

        <div className="btn-container">
          <button type="submit" className="save-btn">
            Save
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
