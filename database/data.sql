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
INSERT INTO users (username, email, password, created_at) VALUES
('john_doe', 'john@example.com', 'hashedpassword1', '2024-03-01 10:00:00'),
('jane_smith', 'jane@example.com', 'hashedpassword2', '2024-03-02 12:30:00'),
('alex_miller', 'alex@example.com', 'hashedpassword3', '2024-03-03 15:45:00');

-- Insert Teams
INSERT INTO teams (user_id, name, created_at) VALUES
(1, 'Red Dragons', '2024-03-05 09:00:00'),
(2, 'Blue Warriors', '2024-03-06 11:15:00'),
(3, 'Green Giants', '2024-03-07 14:30:00');

-- Insert Players
INSERT INTO players (team_id, name, country, position, number) VALUES
(1, 'David Johnson', 'USA', 'Forward', 9),
(1, 'Mark Spencer', 'Canada', 'Midfielder', 7),
(1, 'Carlos Vega', 'Mexico', 'Defender', 5),
(2, 'Emily Carter', 'England', 'Goalkeeper', 1),
(2, 'Ryan Brown', 'Australia', 'Defender', 4),
(3, 'Sarah Wilson', 'Germany', 'Midfielder', 8),
(3, 'Tom Lee', 'South Korea', 'Forward', 10);

-- Insert Matches
INSERT INTO matches (home_team_id, away_team_id, home_score, away_score, match_date,
                     home_scorers, away_scorers, location, home_team_possession,
                     away_team_possession, home_team_shots, away_team_shots,
                     home_team_shots_on_target, away_team_shots_on_target,
                     home_team_fouls, away_team_fouls, home_team_corners,
                     away_team_corners, home_team_offsides, away_team_offsides)
VALUES
-- Match 1: Red Dragons vs. Blue Warriors
(1, 2, 2, 1, '2024-03-10 18:00:00', 'David Johnson, Mark Spencer', 'Ryan Brown', 'Stadium A',
  55, 45, 12, 9, 6, 4, 10, 8, 5, 3, 2, 1),

-- Match 2: Blue Warriors vs. Green Giants
(2, 3, 3, 3, '2024-03-12 20:00:00', 'Ryan Brown, Emily Carter, Ryan Brown', 'Sarah Wilson, Tom Lee, Tom Lee', 'Stadium B',
  50, 50, 15, 15, 8, 7, 12, 10, 4, 6, 3, 3),

-- Match 3: Green Giants vs. Red Dragons
(3, 1, 1, 0, '2024-03-15 16:00:00', 'Tom Lee', '', 'Stadium C',
  48, 52, 10, 8, 5, 3, 7, 6, 2, 1, 1, 2);
