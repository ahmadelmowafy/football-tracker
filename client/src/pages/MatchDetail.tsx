import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MatchDetail.css';

type Match = {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  matchDate: string;
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

export default function MatchDetail() {
  const { matchId } = useParams();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`);
        if (!res.ok) throw new Error('Match not found');
        const data = await res.json();
        setMatch(data);
      } catch (err) {
        alert('Could not load match.');
        console.error(err);
      }
    }

    fetchMatch();
  }, [matchId]);

  if (!match) return <p>Loading match...</p>;

  function splitScorers(scorerString: string): string[] {
    return scorerString
      ? scorerString
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  }

  const homeScorers = splitScorers(match.homeScorers);
  const awayScorers = splitScorers(match.awayScorers);

  return (
    <div className="match-detail-container">
      <h2>Match Detail</h2>
      <Link to="/matches" className="back-link">
        &lt; Back to Matches
      </Link>

      <div className="match-card">
        <div className="team-lineup">
          <div className="team-name">{match.homeTeamName}</div>
          <div className="score-display">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="team-name">{match.awayTeamName}</div>
        </div>

        <p className="match-date">{match.matchDate}</p>

        <div className="scorers-columns">
          <div className="scorer-col left">
            <ul>
              {homeScorers.length === 0 ? (
                <li>—</li>
              ) : (
                homeScorers.map((scorer, i) => <li key={i}>{scorer}</li>)
              )}
            </ul>
          </div>

          <div className="scorer-col right">
            <ul>
              {awayScorers.length === 0 ? (
                <li>—</li>
              ) : (
                awayScorers.map((scorer, i) => <li key={i}>{scorer}</li>)
              )}
            </ul>
          </div>
        </div>

        <div className="stats-box">
          <h4 style={{ fontWeight: 'bold' }}>Stats</h4>
          <div className="stat-row">
            <span>{match.homeTeamPossession}%</span>
            <label>Possession</label>
            <span>{match.awayTeamPossession}%</span>
          </div>
          <div className="stat-row">
            <span>{match.homeTeamShots}</span>
            <label>Shots</label>
            <span>{match.awayTeamShots}</span>
          </div>
          <div className="stat-row">
            <span>{match.homeTeamShotsOnTarget}</span>
            <label>Shots on Target</label>
            <span>{match.awayTeamShotsOnTarget}</span>
          </div>
          <div className="stat-row">
            <span>{match.homeTeamFouls}</span>
            <label>Fouls</label>
            <span>{match.awayTeamFouls}</span>
          </div>
          <div className="stat-row">
            <span>{match.homeTeamCorners}</span>
            <label>Corners</label>
            <span>{match.awayTeamCorners}</span>
          </div>
          <div className="stat-row">
            <span>{match.homeTeamOffsides}</span>
            <label>Offsides</label>
            <span>{match.awayTeamOffsides}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
