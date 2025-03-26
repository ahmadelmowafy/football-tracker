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

        <p className="match-date">
          {new Date(match.matchDate).toLocaleDateString()}
        </p>

        {(match.homeScorers || match.awayScorers) && (
          <p className="scorers-line">
            {[match.homeScorers, match.awayScorers].filter(Boolean).join(', ')}
          </p>
        )}

        <div className="stats-box">
          <h4>Stats</h4>
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
