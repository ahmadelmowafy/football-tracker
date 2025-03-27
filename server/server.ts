/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';

type User = {
  id: number;
  username: string;
  password: string;
};
type Auth = {
  username: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// Registration endpoint
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "password")
        values ($1, $2)
        returning "id", "username";
    `;
    const results = await db.query(sql, [username, hashedPassword]);
    const user = results.rows[0];
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Sign-in endpoint
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
      select "id", "username", "password"
      from "users"
      where "username" = $1;
    `;
    const result = await db.query<User>(sql, [username]);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { id, password: hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { id, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// GET all teams
app.get('/api/teams', async (req, res, next) => {
  try {
    const sql = `
      select * from "teams"
      order by "id";
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET team by ID
app.get('/api/teams/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;
    if (teamId === undefined) throw new ClientError(400, 'teamId is required');
    const sql = `
      select * from "teams"
      where "id" = $1;
    `;
    const params = [teamId];
    const result = await db.query(sql, params);
    const team = result.rows[0];
    if (!team) throw new ClientError(404, `Team with ID ${teamId} not found`);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// POST new team
app.post('/api/teams', async (req, res, next) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name)
      throw new ClientError(400, 'userId and team name are required');
    const sql = `
      insert into "teams" ("userId", "name")
      values ($1, $2)
      returning *;
    `;
    const params = [userId, name];
    const result = await db.query(sql, params);
    const team = result.rows[0];
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
});

// PUT (update) team
app.put('/api/teams/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { name } = req.body;
    if (!teamId || !name)
      throw new ClientError(400, 'teamId and team name are required');
    const sql = `
      update "teams"
        set "name" = $1
        where "id" = $2
        returning *;
    `;
    const params = [name, teamId];
    const result = await db.query(sql, params);
    const updatedTeam = result.rows[0];
    if (!updatedTeam)
      throw new ClientError(404, `Team with ID ${teamId} not found`);
    res.json(updatedTeam);
  } catch (err) {
    next(err);
  }
});

// DELETE team
app.delete('/api/teams/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;
    if (!teamId) throw new ClientError(400, 'teamId is required');
    const sql = `
      delete from "teams"
      where "id" = $1
      returning *;
    `;
    const params = [teamId];
    const result = await db.query(sql, params);
    const team = result.rows[0];
    if (!team) throw new ClientError(404, `Team with ID ${teamId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// GET all matches
app.get('/api/users/:userId/matches', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sql = `
      select * from "matches"
      where "userId" = $1
      order by "matchDate" desc;
    `;
    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET single match by ID
app.get('/api/matches/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const sql = `
      select *
       from "matches"
       where "id" = $1;
    `;
    const params = [matchId];
    const result = await db.query(sql, params);
    const match = result.rows[0];
    if (!match)
      throw new ClientError(404, `Match with ID ${matchId} not found`);
    res.json(match);
  } catch (err) {
    next(err);
  }
});

// POST new match
app.post('/api/matches', async (req, res, next) => {
  try {
    const {
      userId,
      matchDate,
      homeTeamName,
      awayTeamName,
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
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
    } = req.body;
    const sql = `
      insert into "matches" (
        "userId",
        "matchDate", "homeTeamName", "awayTeamName", "homeScore", "awayScore",
        "homeScorers", "awayScorers", "homeTeamPossession",
        "awayTeamPossession", "homeTeamShots", "awayTeamShots",
        "homeTeamShotsOnTarget", "awayTeamShotsOnTarget",
        "homeTeamFouls", "awayTeamFouls", "homeTeamCorners",
        "awayTeamCorners", "homeTeamOffsides", "awayTeamOffsides"
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      returning *;
    `;
    const params = [
      userId,
      matchDate,
      homeTeamName,
      awayTeamName,
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
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
    ];
    const result = await db.query(sql, params);
    const match = result.rows[0];
    res.status(201).json(match);
  } catch (err) {
    next(err);
  }
});

// PUT match (update)
app.put('/api/matches/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const {
      matchDate,
      homeTeamName,
      awayTeamName,
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
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
    } = req.body;

    const sql = `
      update "matches" set
        "matchDate" = $1,
        "homeTeamName" = $2,
        "awayTeamName" = $3,
        "homeScore" = $4,
        "awayScore" = $5,
        "homeScorers" = $6,
        "awayScorers" = $7,
        "homeTeamPossession" = $8,
        "awayTeamPossession" = $9,
        "homeTeamShots" = $10,
        "awayTeamShots" = $11,
        "homeTeamShotsOnTarget" = $12,
        "awayTeamShotsOnTarget" = $13,
        "homeTeamFouls" = $14,
        "awayTeamFouls" = $15,
        "homeTeamCorners" = $16,
        "awayTeamCorners" = $17,
        "homeTeamOffsides" = $18,
        "awayTeamOffsides" = $19
      where "id" = $20
      returning *;
    `;
    const params = [
      matchDate,
      homeTeamName,
      awayTeamName,
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
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
      matchId,
    ];
    const result = await db.query(sql, params);
    const updatedMatch = result.rows[0];
    if (!updatedMatch)
      throw new ClientError(404, `Match with ID ${matchId} not found`);
    res.json(updatedMatch);
  } catch (err) {
    next(err);
  }
});

// DELETE match
app.delete('/api/matches/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const sql = `
      delete from "matches"
      where "id" = $1
      returning *;
    `;
    const params = [matchId];
    const result = await db.query(sql, params);
    const match = result.rows[0];
    if (!match)
      throw new ClientError(404, `Match with ID ${matchId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// POST new player
app.post('/api/players', async (req, res, next) => {
  try {
    const { teamId, name, country, position, number } = req.body;

    if (!teamId || !name || !country || !position || number === undefined) {
      throw new ClientError(400, 'All player fields are required');
    }

    const sql = `
      insert into "players" ("teamId", "name", "country", "position", "number")
      values ($1, $2, $3, $4, $5)
      returning *;
    `;
    const params = [teamId, name, country, position, number];
    const result = await db.query(sql, params);
    const player = result.rows[0];
    res.status(201).json(player);
  } catch (err) {
    next(err);
  }
});

// GET players by teamId
app.get('/api/teams/:teamId/players', async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const teamSql = `select * from "teams" where "id" = $1;`;
    const teamResult = await db.query(teamSql, [teamId]);
    const team = teamResult.rows[0];
    if (!team) throw new ClientError(404, `Team with ID ${teamId} not found`);
    const sql = `
      select * from "players"
      where "teamId" = $1
      order by "id";
    `;
    const playersResult = await db.query(sql, [teamId]);
    res.json({ team, players: playersResult.rows });
  } catch (err) {
    next(err);
  }
});

// GET team by user ID
app.get('/api/user/:userId/team', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sql = `
      select * from "teams"
      where "userId" = $1;
    `;
    const result = await db.query(sql, [userId]);
    const team = result.rows[0];
    if (!team) throw new ClientError(404, 'No team found for this user');
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// PUT (update) a player
app.put('/api/players/:playerId', async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { name, number, country, position } = req.body;

    const sql = `
      update "players"
      set "name" = $1,
          "number" = $2,
          "country" = $3,
          "position" = $4
      where "id" = $5
      returning *;
    `;

    const params = [name, number, country, position, playerId];
    const result = await db.query(sql, params);
    const updated = result.rows[0];

    if (!updated) throw new ClientError(404, 'Player not found');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PUT (update) team name
app.put('/api/teams/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { name } = req.body;

    const sql = `
      update "teams"
      set "name" = $1
      where "id" = $2
      returning *;
    `;
    const result = await db.query(sql, [name, teamId]);
    const updatedTeam = result.rows[0];
    if (!updatedTeam) throw new ClientError(404, 'Team not found');
    res.json(updatedTeam);
  } catch (err) {
    next(err);
  }
});

app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
