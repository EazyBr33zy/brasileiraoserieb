// Data scraped from FBref.com - Brazilian Serie B 2026

export interface TeamStanding {
  rank: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  ptsPerMatch: number;
  topScorer: string;
  topScorerGoals: number;
  goalkeeper: string;
}

export interface PlayerStat {
  name: string;
  team: string;
  goals: number;
  assists: number;
  goalsPer90: number;
  assistsPer90: number;
  shots: number;
  shotsOnTarget: number;
  crosses?: number;
  tacklesWon?: number;
  interceptions?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface SquadStat {
  team: string;
  players: number;
  avgAge: number;
  possession: number;
  matchesPlayed: number;
  goals: number;
  assists: number;
  goalsPer90: number;
  assistsPer90: number;
  shots: number;
  shotsOnTarget: number;
  yellowCards: number;
  redCards: number;
  fouls: number;
}

export const standings: TeamStanding[] = [
  { rank: 1, team: "Vila Nova", played: 30, wins: 16, draws: 6, losses: 8, goalsFor: 43, goalsAgainst: 31, goalDiff: 12, points: 54, ptsPerMatch: 1.80, topScorer: "André Luis", topScorerGoals: 8, goalkeeper: "Helton Leite" },
  { rank: 2, team: "Novorizontino", played: 31, wins: 15, draws: 9, losses: 7, goalsFor: 52, goalsAgainst: 27, goalDiff: 25, points: 54, ptsPerMatch: 1.74, topScorer: "Robson", topScorerGoals: 16, goalkeeper: "Jordi Almeida" },
  { rank: 3, team: "Juventude", played: 30, wins: 15, draws: 8, losses: 7, goalsFor: 32, goalsAgainst: 19, goalDiff: 13, points: 53, ptsPerMatch: 1.77, topScorer: "Safira", topScorerGoals: 6, goalkeeper: "Jandrei" },
  { rank: 4, team: "Fortaleza", played: 30, wins: 14, draws: 10, losses: 6, goalsFor: 35, goalsAgainst: 26, goalDiff: 9, points: 52, ptsPerMatch: 1.73, topScorer: "Mailton", topScorerGoals: 7, goalkeeper: "João Ricardo Riedi" },
  { rank: 5, team: "Criciúma", played: 30, wins: 14, draws: 8, losses: 8, goalsFor: 31, goalsAgainst: 27, goalDiff: 4, points: 50, ptsPerMatch: 1.67, topScorer: "Marcelo Hermes / Fellipe Mateus", topScorerGoals: 4, goalkeeper: "Airton Moraes" },
  { rank: 6, team: "Atl. Goianiense", played: 30, wins: 13, draws: 10, losses: 7, goalsFor: 37, goalsAgainst: 27, goalDiff: 10, points: 49, ptsPerMatch: 1.63, topScorer: "Gustavo Coutinho", topScorerGoals: 13, goalkeeper: "Paulo Vítor" },
  { rank: 7, team: "CRB", played: 30, wins: 14, draws: 6, losses: 10, goalsFor: 45, goalsAgainst: 41, goalDiff: 4, points: 48, ptsPerMatch: 1.60, topScorer: "Mikael", topScorerGoals: 16, goalkeeper: "Vitor Caetano" },
  { rank: 8, team: "Operário", played: 30, wins: 13, draws: 9, losses: 8, goalsFor: 43, goalsAgainst: 38, goalDiff: 5, points: 48, ptsPerMatch: 1.60, topScorer: "Gabriel Boschilia", topScorerGoals: 13, goalkeeper: "Vagner da Silva" },
  { rank: 9, team: "Sport Recife", played: 31, wins: 12, draws: 11, losses: 8, goalsFor: 42, goalsAgainst: 33, goalDiff: 9, points: 47, ptsPerMatch: 1.52, topScorer: "Pedro Perotti / Chrystian Barletta", topScorerGoals: 11, goalkeeper: "Thiago" },
  { rank: 10, team: "Cuiabá", played: 30, wins: 10, draws: 13, losses: 7, goalsFor: 30, goalsAgainst: 25, goalDiff: 5, points: 43, ptsPerMatch: 1.43, topScorer: "Kauan", topScorerGoals: 6, goalkeeper: "Marcelo Carné" },
  { rank: 11, team: "Goiás", played: 31, wins: 12, draws: 6, losses: 13, goalsFor: 30, goalsAgainst: 39, goalDiff: -9, points: 42, ptsPerMatch: 1.35, topScorer: "Kadu", topScorerGoals: 9, goalkeeper: "Tadeu" },
  { rank: 12, team: "São Bernardo", played: 30, wins: 11, draws: 9, losses: 10, goalsFor: 40, goalsAgainst: 31, goalDiff: 9, points: 42, ptsPerMatch: 1.40, topScorer: "Pedrinho", topScorerGoals: 5, goalkeeper: "Alex Alves de Lima" },
  { rank: 13, team: "Athletic", played: 31, wins: 10, draws: 12, losses: 9, goalsFor: 37, goalsAgainst: 35, goalDiff: 2, points: 42, ptsPerMatch: 1.35, topScorer: "Ronaldo Tavares", topScorerGoals: 5, goalkeeper: "Luan Polli" },
  { rank: 14, team: "Náutico", played: 30, wins: 11, draws: 8, losses: 11, goalsFor: 38, goalsAgainst: 37, goalDiff: 1, points: 41, ptsPerMatch: 1.37, topScorer: "Vinícius", topScorerGoals: 9, goalkeeper: "Muriel Becker" },
  { rank: 15, team: "Ceará", played: 30, wins: 9, draws: 9, losses: 12, goalsFor: 33, goalsAgainst: 39, goalDiff: -6, points: 36, ptsPerMatch: 1.20, topScorer: "Melk", topScorerGoals: 8, goalkeeper: "Richard" },
  { rank: 16, team: "Botafogo (SP)", played: 30, wins: 9, draws: 8, losses: 13, goalsFor: 34, goalsAgainst: 36, goalDiff: -2, points: 35, ptsPerMatch: 1.17, topScorer: "Everton Morelli", topScorerGoals: 8, goalkeeper: "Victor Souza" },
  { rank: 17, team: "Avaí", played: 30, wins: 8, draws: 6, losses: 16, goalsFor: 30, goalsAgainst: 41, goalDiff: -11, points: 30, ptsPerMatch: 1.00, topScorer: "Daniel Penha", topScorerGoals: 5, goalkeeper: "Léo Aragão" },
  { rank: 18, team: "Londrina", played: 30, wins: 7, draws: 7, losses: 16, goalsFor: 39, goalsAgainst: 43, goalDiff: -4, points: 28, ptsPerMatch: 0.93, topScorer: "Bruno Santos", topScorerGoals: 11, goalkeeper: "Maurício Kozlinski" },
  { rank: 19, team: "América-MG", played: 30, wins: 4, draws: 5, losses: 21, goalsFor: 21, goalsAgainst: 50, goalDiff: -29, points: 17, ptsPerMatch: 0.57, topScorer: "Gonzalo Mastriani / Willian", topScorerGoals: 4, goalkeeper: "Gustavo" },
  { rank: 20, team: "Ponte Preta", played: 30, wins: 3, draws: 4, losses: 23, goalsFor: 17, goalsAgainst: 64, goalDiff: -47, points: 13, ptsPerMatch: 0.43, topScorer: "Brandão", topScorerGoals: 4, goalkeeper: "Diogo Silva" },
];

export const topScorers: PlayerStat[] = [
  { name: "Mikael", team: "CRB", goals: 16, assists: 4, goalsPer90: 0.61, assistsPer90: 0.15, shots: 113, shotsOnTarget: 49 },
  { name: "Robson", team: "Novorizontino", goals: 16, assists: 5, goalsPer90: 0.59, assistsPer90: 0.19, shots: 84, shotsOnTarget: 32 },
  { name: "Gustavo Coutinho", team: "Atl. Goianiense", goals: 13, assists: 0, goalsPer90: 0.62, assistsPer90: 0.00, shots: 70, shotsOnTarget: 30 },
  { name: "Gabriel Boschilia", team: "Operário", goals: 13, assists: 4, goalsPer90: 0.47, assistsPer90: 0.14, shots: 88, shotsOnTarget: 32 },
  { name: "Bruno Santos", team: "Londrina", goals: 11, assists: 3, goalsPer90: 0.71, assistsPer90: 0.19, shots: 55, shotsOnTarget: 20 },
  { name: "Pedro Perotti", team: "Sport Recife", goals: 11, assists: 1, goalsPer90: 0.40, assistsPer90: 0.04, shots: 74, shotsOnTarget: 30 },
  { name: "Chrystian Barletta", team: "Sport Recife", goals: 11, assists: 3, goalsPer90: 0.46, assistsPer90: 0.13, shots: 52, shotsOnTarget: 18 },
  { name: "Romulo", team: "Novorizontino", goals: 10, assists: 9, goalsPer90: 0.37, assistsPer90: 0.33, shots: 63, shotsOnTarget: 27 },
  { name: "Kadu", team: "Goiás", goals: 9, assists: 2, goalsPer90: 0.52, assistsPer90: 0.12, shots: 48, shotsOnTarget: 24 },
  { name: "Vinícius", team: "Náutico", goals: 9, assists: 3, goalsPer90: 0.43, assistsPer90: 0.14, shots: 64, shotsOnTarget: 25 },
];

export const topAssists: PlayerStat[] = [
  { name: "Romulo", team: "Novorizontino", goals: 10, assists: 9, goalsPer90: 0.37, assistsPer90: 0.33, shots: 63, shotsOnTarget: 27, crosses: 215 },
  { name: "Geovany Soares", team: "Atl. Goianiense", goals: 5, assists: 8, goalsPer90: 0.22, assistsPer90: 0.34, shots: 35, shotsOnTarget: 14, crosses: 98 },
  { name: "Janderson", team: "Vila Nova", goals: 7, assists: 7, goalsPer90: 0.30, assistsPer90: 0.30, shots: 42, shotsOnTarget: 18, crosses: 87 },
  { name: "Rafael Gava", team: "Botafogo (SP)", goals: 4, assists: 7, goalsPer90: 0.17, assistsPer90: 0.30, shots: 38, shotsOnTarget: 12, crosses: 174 },
  { name: "Marquinhos Gabriel", team: "Vila Nova", goals: 5, assists: 7, goalsPer90: 0.20, assistsPer90: 0.28, shots: 30, shotsOnTarget: 11, crosses: 95 },
  { name: "Adailson Dadá", team: "CRB", goals: 6, assists: 6, goalsPer90: 0.23, assistsPer90: 0.23, shots: 87, shotsOnTarget: 26, crosses: 127 },
  { name: "Mikael Doka", team: "Operário", goals: 4, assists: 5, goalsPer90: 0.18, assistsPer90: 0.23, shots: 28, shotsOnTarget: 10, crosses: 72 },
  { name: "Melk", team: "Ceará", goals: 8, assists: 5, goalsPer90: 0.36, assistsPer90: 0.23, shots: 69, shotsOnTarget: 27, crosses: 85 },
  { name: "Crystopher", team: "CRB", goals: 4, assists: 5, goalsPer90: 0.18, assistsPer90: 0.23, shots: 32, shotsOnTarget: 12, crosses: 65 },
  { name: "Juninho", team: "Novorizontino", goals: 5, assists: 5, goalsPer90: 0.34, assistsPer90: 0.42, shots: 50, shotsOnTarget: 21, crosses: 78 },
];

export const squadStats: SquadStat[] = [
  { team: "Novorizontino", players: 32, avgAge: 28.1, possession: 48.5, matchesPlayed: 31, goals: 52, assists: 38, goalsPer90: 1.68, assistsPer90: 1.23, shots: 500, shotsOnTarget: 174, yellowCards: 61, redCards: 1, fouls: 411 },
  { team: "Vila Nova", players: 36, avgAge: 29.5, possession: 51.2, matchesPlayed: 30, goals: 43, assists: 30, goalsPer90: 1.39, assistsPer90: 0.97, shots: 421, shotsOnTarget: 132, yellowCards: 80, redCards: 5, fouls: 469 },
  { team: "CRB", players: 31, avgAge: 28.8, possession: 52.3, matchesPlayed: 30, goals: 45, assists: 33, goalsPer90: 1.45, assistsPer90: 1.06, shots: 590, shotsOnTarget: 196, yellowCards: 76, redCards: 3, fouls: 376 },
  { team: "Operário", players: 29, avgAge: 31.0, possession: 51.6, matchesPlayed: 30, goals: 42, assists: 24, goalsPer90: 1.35, assistsPer90: 0.77, shots: 435, shotsOnTarget: 132, yellowCards: 77, redCards: 2, fouls: 448 },
  { team: "Sport Recife", players: 41, avgAge: 27.5, possession: 54.0, matchesPlayed: 31, goals: 41, assists: 27, goalsPer90: 1.32, assistsPer90: 0.87, shots: 414, shotsOnTarget: 125, yellowCards: 70, redCards: 3, fouls: 402 },
  { team: "São Bernardo", players: 34, avgAge: 31.8, possession: 50.5, matchesPlayed: 30, goals: 43, assists: 29, goalsPer90: 1.39, assistsPer90: 0.94, shots: 370, shotsOnTarget: 134, yellowCards: 66, redCards: 2, fouls: 365 },
  { team: "Atl. Goianiense", players: 39, avgAge: 28.5, possession: 49.2, matchesPlayed: 30, goals: 39, assists: 29, goalsPer90: 1.26, assistsPer90: 0.94, shots: 459, shotsOnTarget: 139, yellowCards: 65, redCards: 4, fouls: 476 },
  { team: "Náutico", players: 42, avgAge: 30.8, possession: 57.1, matchesPlayed: 30, goals: 38, assists: 24, goalsPer90: 1.23, assistsPer90: 0.77, shots: 511, shotsOnTarget: 142, yellowCards: 83, redCards: 4, fouls: 506 },
  { team: "Londrina", players: 43, avgAge: 28.6, possession: 46.5, matchesPlayed: 30, goals: 37, assists: 27, goalsPer90: 1.19, assistsPer90: 0.87, shots: 429, shotsOnTarget: 124, yellowCards: 77, redCards: 4, fouls: 423 },
  { team: "Athletic", players: 38, avgAge: 25.2, possession: 44.3, matchesPlayed: 31, goals: 36, assists: 25, goalsPer90: 1.16, assistsPer90: 0.81, shots: 363, shotsOnTarget: 107, yellowCards: 73, redCards: 9, fouls: 460 },
  { team: "Ceará", players: 46, avgAge: 28.1, possession: 51.0, matchesPlayed: 30, goals: 34, assists: 26, goalsPer90: 1.10, assistsPer90: 0.84, shots: 427, shotsOnTarget: 136, yellowCards: 73, redCards: 4, fouls: 445 },
  { team: "Juventude", players: 32, avgAge: 29.9, possession: 50.2, matchesPlayed: 30, goals: 34, assists: 23, goalsPer90: 1.10, assistsPer90: 0.74, shots: 398, shotsOnTarget: 132, yellowCards: 68, redCards: 0, fouls: 528 },
  { team: "Botafogo (SP)", players: 34, avgAge: 29.5, possession: 49.1, matchesPlayed: 30, goals: 33, assists: 21, goalsPer90: 1.06, assistsPer90: 0.68, shots: 380, shotsOnTarget: 104, yellowCards: 74, redCards: 1, fouls: 461 },
  { team: "Fortaleza", players: 34, avgAge: 28.7, possession: 49.5, matchesPlayed: 30, goals: 32, assists: 18, goalsPer90: 1.03, assistsPer90: 0.58, shots: 431, shotsOnTarget: 129, yellowCards: 72, redCards: 6, fouls: 442 },
  { team: "Criciúma", players: 29, avgAge: 32.2, possession: 53.7, matchesPlayed: 30, goals: 32, assists: 22, goalsPer90: 1.03, assistsPer90: 0.71, shots: 437, shotsOnTarget: 119, yellowCards: 72, redCards: 1, fouls: 459 },
  { team: "Goiás", players: 32, avgAge: 29.7, possession: 53.7, matchesPlayed: 31, goals: 30, assists: 19, goalsPer90: 0.97, assistsPer90: 0.61, shots: 393, shotsOnTarget: 123, yellowCards: 69, redCards: 6, fouls: 419 },
  { team: "Cuiabá", players: 35, avgAge: 27.8, possession: 48.3, matchesPlayed: 30, goals: 30, assists: 20, goalsPer90: 0.97, assistsPer90: 0.65, shots: 415, shotsOnTarget: 131, yellowCards: 63, redCards: 2, fouls: 468 },
  { team: "Avaí", players: 46, avgAge: 27.0, possession: 46.4, matchesPlayed: 30, goals: 29, assists: 18, goalsPer90: 0.94, assistsPer90: 0.58, shots: 363, shotsOnTarget: 104, yellowCards: 84, redCards: 5, fouls: 461 },
  { team: "América-MG", players: 48, avgAge: 29.0, possession: 53.4, matchesPlayed: 30, goals: 21, assists: 15, goalsPer90: 0.68, assistsPer90: 0.48, shots: 423, shotsOnTarget: 141, yellowCards: 63, redCards: 1, fouls: 426 },
  { team: "Ponte Preta", players: 51, avgAge: 27.3, possession: 40.5, matchesPlayed: 30, goals: 17, assists: 11, goalsPer90: 0.55, assistsPer90: 0.35, shots: 314, shotsOnTarget: 95, yellowCards: 89, redCards: 10, fouls: 500 },
];

export const topDefenders = [
  { name: "Rodrigo Sam", team: "Juventude", tacklesWon: 37, interceptions: 50 },
  { name: "João Othavio Basso", team: "Cuiabá", tacklesWon: 28, interceptions: 49 },
  { name: "Rodrigo Fagundes", team: "Criciúma", tacklesWon: 30, interceptions: 47 },
  { name: "DG", team: "Avaí", tacklesWon: 50, interceptions: 46 },
  { name: "Wenderson", team: "Náutico", tacklesWon: 37, interceptions: 44 },
  { name: "João Miguel", team: "Athletic", tacklesWon: 25, interceptions: 43 },
  { name: "Raul", team: "Cuiabá", tacklesWon: 32, interceptions: 43 },
  { name: "Gustavo Vilar", team: "Botafogo (SP)", tacklesWon: 29, interceptions: 41 },
  { name: "César", team: "Criciúma", tacklesWon: 33, interceptions: 40 },
  { name: "Adriano Martins", team: "Atl. Goianiense", tacklesWon: 27, interceptions: 39 },
];

export const topCrossers = [
  { name: "Romulo", team: "Novorizontino", crosses: 215 },
  { name: "Mailton", team: "Fortaleza", crosses: 198 },
  { name: "Rafael Gava", team: "Botafogo (SP)", crosses: 174 },
  { name: "Rómulo Otero", team: "Criciúma", crosses: 158 },
  { name: "Gabriel Boschilia", team: "Operário", crosses: 156 },
  { name: "Guilherme Lopes", team: "Atl. Goianiense", crosses: 141 },
  { name: "Dodô", team: "Náutico", crosses: 133 },
  { name: "Jean Carlos Vicente", team: "Náutico", crosses: 131 },
  { name: "Adailson Dadá", team: "CRB", crosses: 127 },
  { name: "Jean Lucas", team: "Avaí", crosses: 124 },
];
