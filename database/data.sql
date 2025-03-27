-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

-- Insert Users
INSERT INTO "users" ("username", "password") VALUES
('john_doe', 'hashed_password1');

-- Insert Teams
INSERT INTO "teams" ("userId", "name") VALUES
(1, 'Red Dragons');

-- Insert Players
INSERT INTO "players" ("teamId", "name", "country", "position", "number") VALUES
(1, 'David Johnson', 'USA', 'Forward', 9);

-- Insert Matches
INSERT INTO matches ("userId", "matchDate", "homeTeamName", "awayTeamName", "homeScore", "awayScore",
                       "homeScorers", "awayScorers", "homeTeamPossession",
                       "awayTeamPossession", "homeTeamShots", "awayTeamShots",
                       "homeTeamShotsOnTarget", "awayTeamShotsOnTarget",
                       "homeTeamFouls", "awayTeamFouls", "homeTeamCorners",
                       "awayTeamCorners", "homeTeamOffsides", "awayTeamOffsides")
VALUES
(1, '2024-08-08', 'Seattle Sounders', 'LA Galaxy', 3, 1, 'Andrade 4'', Ragen 7'', Roldan 45''', 'Gabriel Pec 83''',
 37, 63, 21, 8, 12, 2, 13, 8, 13, 6, 0, 1);
