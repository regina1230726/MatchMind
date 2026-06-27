DELETE FROM predictions;
DELETE FROM matches;
DELETE FROM teams;

ALTER SEQUENCE teams_id_seq RESTART WITH 1;
ALTER SEQUENCE matches_id_seq RESTART WITH 1;
ALTER SEQUENCE predictions_id_seq RESTART WITH 1;

INSERT INTO teams (name, code, flag_url, fifa_ranking, group_name) VALUES
                                                                       ('Portugal', 'POR', 'https://flagcdn.com/w320/pt.png', 6, 'K'),
                                                                       ('Brazil', 'BRA', 'https://flagcdn.com/w320/br.png', 5, 'C'),
                                                                       ('Argentina', 'ARG', 'https://flagcdn.com/w320/ar.png', 1, 'J'),
                                                                       ('France', 'FRA', 'https://flagcdn.com/w320/fr.png', 2, 'I'),
                                                                       ('Spain', 'ESP', 'https://flagcdn.com/w320/es.png', 8, 'H'),
                                                                       ('England', 'ENG', 'https://flagcdn.com/w320/gb-eng.png', 4, 'L'),
                                                                       ('Germany', 'GER', 'https://flagcdn.com/w320/de.png', 10, 'E'),
                                                                       ('Netherlands', 'NED', 'https://flagcdn.com/w320/nl.png', 7, 'F'),
                                                                       ('Belgium', 'BEL', 'https://flagcdn.com/w320/be.png', 3, 'G'),
                                                                       ('Uruguay', 'URU', 'https://flagcdn.com/w320/uy.png', 11, 'H'),
                                                                       ('Colombia', 'COL', 'https://flagcdn.com/w320/co.png', 12, 'K'),
                                                                       ('Croatia', 'CRO', 'https://flagcdn.com/w320/hr.png', 13, 'L');

INSERT INTO matches
(match_date, stage, home_team_id, away_team_id, home_score, away_score, status)
VALUES
    ('2026-06-23 18:00:00', 'Group K', 1, 11, NULL, NULL, 'SCHEDULED'),
    ('2026-06-24 20:00:00', 'Group C', 2, 3, NULL, NULL, 'SCHEDULED'),
    ('2026-06-25 21:00:00', 'Group J', 3, 4, NULL, NULL, 'SCHEDULED'),
    ('2026-06-26 20:00:00', 'Group H', 5, 10, NULL, NULL, 'SCHEDULED'),
    ('2026-06-27 17:00:00', 'Group L', 6, 12, NULL, NULL, 'SCHEDULED'),
    ('2026-06-28 16:00:00', 'Group E', 7, 8, NULL, NULL, 'SCHEDULED'),
    ('2026-06-29 19:00:00', 'Group G', 9, 5, NULL, NULL, 'SCHEDULED'),
    ('2026-06-30 21:00:00', 'Round of 32', 1, 2, NULL, NULL, 'SCHEDULED'),
    ('2026-06-18 19:00:00', 'Group I', 4, 5, 2, 1, 'FINISHED'),
    ('2026-06-19 20:00:00', 'Group H', 10, 6, 1, 1, 'FINISHED');

INSERT INTO predictions
(match_id, home_win_probability, draw_probability, away_win_probability, predicted_outcome, model_version, generated_at)
VALUES
    (1, 0.58, 0.24, 0.18, 'HOME_WIN', 'v1.0', NOW()),
    (2, 0.39, 0.26, 0.35, 'HOME_WIN', 'v1.0', NOW()),
    (3, 0.47, 0.25, 0.28, 'HOME_WIN', 'v1.0', NOW()),
    (4, 0.52, 0.27, 0.21, 'HOME_WIN', 'v1.0', NOW()),
    (5, 0.45, 0.29, 0.26, 'HOME_WIN', 'v1.0', NOW()),
    (6, 0.40, 0.28, 0.32, 'HOME_WIN', 'v1.0', NOW()),
    (7, 0.34, 0.30, 0.36, 'AWAY_WIN', 'v1.0', NOW()),
    (8, 0.42, 0.25, 0.33, 'HOME_WIN', 'v1.0', NOW()),
    (9, 0.61, 0.22, 0.17, 'HOME_WIN', 'v1.0', NOW()),
    (10, 0.33, 0.31, 0.36, 'AWAY_WIN', 'v1.0', NOW());