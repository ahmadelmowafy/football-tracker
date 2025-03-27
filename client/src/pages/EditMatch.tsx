import { useEffect, useRef, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddMatch.css';

type Match = {
  id: number;
  matchDate: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeScorers: string;
  awayScorers: string;
  homeTeamPossession: number;
  awayTeamPossession: number;
  homeTeamShots: number;
  awayTeamShots: number;
  homeTeamShotsOnTarget: number;
  awayTeamShotsOnTarget: number;
  homeTeamFouls: number;
  awayTeamFouls: number;
  homeTeamCorners: number;
  awayTeamCorners: number;
  homeTeamOffsides: number;
  awayTeamOffsides: number;
};

export default function EditMatch() {
  const { matchId } = useParams();
  const ref = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`);
        if (!res.ok) throw new Error('Match not found');
        const data = await res.json();
        setMatch(data);
        populateForm(data);
      } catch (err) {
        console.error(err);
        alert('Could not load match.');
      }
    }

    function populateForm(match: Match) {
      if (!ref.current) return;

      const form = ref.current;
      form.matchDate.value = match.matchDate;
      form.homeTeam.value = match.homeTeamName;
      form.awayTeam.value = match.awayTeamName;
      form.homeScore.value = match.homeScore;
      form.awayScore.value = match.awayScore;

      form.homeTeamPossession.value = match.homeTeamPossession;
      form.awayTeamPossession.value = match.awayTeamPossession;
      form.homeTeamShots.value = match.homeTeamShots;
      form.awayTeamShots.value = match.awayTeamShots;
      form.homeTeamShotsOnTarget.value = match.homeTeamShotsOnTarget;
      form.awayTeamShotsOnTarget.value = match.awayTeamShotsOnTarget;
      form.homeTeamFouls.value = match.homeTeamFouls;
      form.awayTeamFouls.value = match.awayTeamFouls;
      form.homeTeamCorners.value = match.homeTeamCorners;
      form.awayTeamCorners.value = match.awayTeamCorners;
      form.homeTeamOffsides.value = match.homeTeamOffsides;
      form.awayTeamOffsides.value = match.awayTeamOffsides;

      populateScorers('home', match.homeScorers);
      populateScorers('away', match.awayScorers);
    }

    function populateScorers(team: string, scorerString: string) {
      const container = document.getElementById(`${team}-scorers`);
      if (!container) return;

      container.innerHTML = '';

      const scorers = scorerString.split(',').map((s) => s.trim());
      scorers.forEach((entry) => {
        const [name, minuteRaw] = entry.split(' ');
        const minute = minuteRaw?.replace("'", '') || '';

        const wrapper = document.createElement('div');
        wrapper.className = 'scorer-info';

        const nameInput = document.createElement('input');
        nameInput.name = `${team}Scorer`;
        nameInput.placeholder = 'Scorer';
        nameInput.value = name;

        const minInput = document.createElement('input');
        minInput.name = `${team}Minute`;
        minInput.placeholder = 'min';
        minInput.value = minute;

        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.className = 'remove-scorer-button';
        removeButton.onclick = () => container.removeChild(wrapper);

        wrapper.appendChild(removeButton);
        wrapper.appendChild(nameInput);
        wrapper.appendChild(minInput);
        container.appendChild(wrapper);
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
      <form onSubmit={handleSubmit} ref={ref} className="match-form">
        <div className="match-date-wrapper">
          <label>
            Match Date:
            <input type="date" name="matchDate" required />
          </label>
        </div>

        <div className="teams-row">
          <div className="team-box left">
            <img
              src="https://banner2.cleanpng.com/20180616/jce/aa60lk12n.webp"
              alt="home team logo"
              className="team-logo"
            />
            <input name="homeTeam" placeholder="Home Team" required />
            <div id="home-scorers" className="scorers-box" />
            <button type="button" onClick={() => addScorer('home')}>
              Add Scorer
            </button>
          </div>

          <div className="score-box">
            <input type="number" name="homeScore" required />
            <span>-</span>
            <input type="number" name="awayScore" required />
          </div>

          <div className="team-box right">
            <img
              src="https://banner2.cleanpng.com/20180616/jce/aa60lk12n.webp"
              alt="away team logo"
              className="team-logo"
            />
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
            SAVE CHANGES
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/matches')}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
