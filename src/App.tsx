import { useState } from 'react';
import { standings, topScorers, topAssists, squadStats, topDefenders, topCrossers } from './data/serieB2026';
import { criciumaPlayers, criciumaTeamStats } from './data/criciumaPlayers';

type TabType = 'overview' | 'standings' | 'scorers' | 'assists' | 'squads' | 'defenders' | 'criciuma';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 via-green-700 to-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⚽</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Campeonato Brasileiro Série B 2026
                </h1>
                <p className="text-green-100 text-sm">
                  Football Analytics Dashboard • Dados via FBref.com
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-black/20 rounded-lg px-4 py-2">
              <span className="text-yellow-300 text-sm font-medium">🇧🇷 20 Times</span>
              <span className="text-green-200 text-sm">•</span>
              <span className="text-yellow-300 text-sm font-medium">Temporada 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {[
              { id: 'overview' as TabType, label: '📊 Visão Geral', icon: '' },
              { id: 'standings' as TabType, label: '🏆 Classificação', icon: '' },
              { id: 'scorers' as TabType, label: '⚽ Artilheiros', icon: '' },
              { id: 'assists' as TabType, label: '🎯 Assistências', icon: '' },
              { id: 'squads' as TabType, label: '👥 Equipes', icon: '' },
              { id: 'defenders' as TabType, label: '🛡️ Defensores', icon: '' },
              { id: 'criciuma' as TabType, label: '🔴 Criciúma', icon: '' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'standings' && <StandingsTab />}
        {activeTab === 'scorers' && <ScorersTab />}
        {activeTab === 'assists' && <AssistsTab />}
        {activeTab === 'squads' && <SquadsTab />}
        {activeTab === 'defenders' && <DefendersTab />}
        {activeTab === 'criciuma' && <CriciumaTab />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Dados extraídos via Web Scraping do FBref.com • Campeonato Brasileiro Série B 2026</p>
          <p className="mt-1">Inspirado no projeto Football Analytics Data Engineering</p>
        </div>
      </footer>
    </div>
  );
}

function OverviewTab() {
  const totalGoals = standings.reduce((sum, t) => sum + t.goalsFor, 0);
  const totalMatches = standings.reduce((sum, t) => sum + t.played, 0) / 2;
  const avgGoalsPerMatch = (totalGoals / totalMatches).toFixed(2);
  const topTeam = standings[0];
  const worstTeam = standings[standings.length - 1];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Líder"
          value={topTeam.team}
          subtitle={`${topTeam.points} pts • ${topTeam.wins}V ${topTeam.draws}E ${topTeam.losses}D`}
          color="green"
          icon="🏆"
        />
        <StatCard
          title="Artilheiros"
          value="Mikael (CRB) & Robson (Novo)"
          subtitle="16 gols cada"
          color="yellow"
          icon="⚽"
        />
        <StatCard
          title="Média de Gols/Jogo"
          value={avgGoalsPerMatch}
          subtitle={`${totalGoals} gols em ${totalMatches} jogos`}
          color="blue"
          icon="📈"
        />
        <StatCard
          title="Lanterna"
          value={worstTeam.team}
          subtitle={`${worstTeam.points} pts • GD: ${worstTeam.goalDiff}`}
          color="red"
          icon="📉"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals by Team */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">⚽ Gols Marcados por Equipe</h3>
          <div className="space-y-2">
            {[...standings]
              .sort((a, b) => b.goalsFor - a.goalsFor)
              .slice(0, 10)
              .map((team) => (
                <div key={team.team} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-32 truncate">{team.team}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(team.goalsFor / 52) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{team.goalsFor}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Points Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🏆 Pontos por Equipe</h3>
          <div className="space-y-2">
            {standings.slice(0, 10).map((team) => (
              <div key={team.team} className="flex items-center gap-3">
                <span className="text-sm text-gray-300 w-32 truncate">{team.team}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${(team.points / 54) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{team.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🥇 Top 5 Artilheiros</h3>
          <div className="space-y-3">
            {topScorers.slice(0, 5).map((player, idx) => (
              <div key={player.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                    {idx + 1}.
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.team}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-400">{player.goals}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Top 5 Assistências</h3>
          <div className="space-y-3">
            {topAssists.slice(0, 5).map((player, idx) => (
              <div key={player.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                    {idx + 1}.
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.team}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-400">{player.assists}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🛡️ Top Defensores</h3>
          <div className="space-y-3">
            {topDefenders.slice(0, 5).map((player, idx) => (
              <div key={player.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                    {idx + 1}.
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-purple-400">{player.interceptions} INT</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">📡 Sobre os Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Dados extraídos via web scraping do <strong className="text-white">FBref.com</strong></p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Estatísticas completas de <strong className="text-white">20 equipes</strong> da Série B 2026</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Inclui gols, assistências, desarmes, interceptações e mais</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StandingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">🏆 Classificação - Série B 2026</h2>
          <p className="text-gray-400 text-sm mt-1">Tabela completa com estatísticas de todas as equipes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">#</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Equipe</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">J</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">V</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">E</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">D</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">GP</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">GC</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">SG</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Pts</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Pts/J</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <tr
                  key={team.team}
                  className={`border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    team.rank <= 4 ? 'bg-green-900/10' : team.rank >= 17 ? 'bg-red-900/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      team.rank <= 4 ? 'bg-green-600 text-white' : team.rank >= 17 ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {team.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{team.team}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{team.played}</td>
                  <td className="px-4 py-3 text-center text-green-400">{team.wins}</td>
                  <td className="px-4 py-3 text-center text-yellow-400">{team.draws}</td>
                  <td className="px-4 py-3 text-center text-red-400">{team.losses}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{team.goalsFor}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{team.goalsAgainst}</td>
                  <td className={`px-4 py-3 text-center font-medium ${team.goalDiff > 0 ? 'text-green-400' : team.goalDiff < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                    {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-white">{team.points}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{team.ptsPerMatch.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-700 flex flex-wrap gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-600"></span> Zona de acesso (G4)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-600"></span> Zona de rebaixamento
          </span>
        </div>
      </div>

      {/* Team Top Scorers */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">⚽ Artilheiros de Cada Equipe</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">#</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Equipe</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Artilheiro</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Gols</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Goleiro</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <tr key={team.team} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400">{team.rank}</td>
                  <td className="px-4 py-3 font-medium text-white">{team.team}</td>
                  <td className="px-4 py-3 text-gray-300">{team.topScorer}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-400">{team.topScorerGoals}</td>
                  <td className="px-4 py-3 text-gray-300">{team.goalkeeper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ScorersTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">⚽ Artilheiros - Série B 2026</h2>
          <p className="text-gray-400 text-sm mt-1">Top 10 goleadores com estatísticas de finalização</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">#</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Jogador</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Equipe</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Gols</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Assist.</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Gols/90</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Chutes</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">No Alvo</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Precisão</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((player, idx) => (
                <tr key={player.name} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{player.name}</td>
                  <td className="px-4 py-3 text-gray-300">{player.team}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-400 text-lg">{player.goals}</td>
                  <td className="px-4 py-3 text-center text-blue-400">{player.assists}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{player.goalsPer90.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{player.shots}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{player.shotsOnTarget}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      (player.shotsOnTarget / player.shots * 100) >= 40 ? 'bg-green-900/50 text-green-400' :
                      (player.shotsOnTarget / player.shots * 100) >= 30 ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {(player.shotsOnTarget / player.shots * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Comparison */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📊 Comparação Visual - Gols vs Chutes</h3>
        <div className="space-y-3">
          {topScorers.map((player) => (
            <div key={player.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 w-36 truncate">{player.name}</span>
              <div className="flex-1 flex gap-1">
                <div className="relative h-8 flex-1 bg-gray-700 rounded overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-400 rounded flex items-center px-2"
                    style={{ width: `${(player.goals / 16) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{player.goals} gols</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssistsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">🎯 Líderes em Assistências - Série B 2026</h2>
          <p className="text-gray-400 text-sm mt-1">Top 10 jogadores com mais assistências e cruzamentos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">#</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Jogador</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Equipe</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Assist.</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Gols</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">G+A</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Assist/90</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Cruzamentos</th>
              </tr>
            </thead>
            <tbody>
              {topAssists.map((player, idx) => (
                <tr key={player.name} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{player.name}</td>
                  <td className="px-4 py-3 text-gray-300">{player.team}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-400 text-lg">{player.assists}</td>
                  <td className="px-4 py-3 text-center text-green-400">{player.goals}</td>
                  <td className="px-4 py-3 text-center font-bold text-purple-400">{player.goals + player.assists}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{player.assistsPer90.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{player.crosses || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Crossers */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">📐 Líderes em Cruzamentos</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {topCrossers.map((player, idx) => (
              <div key={player.name} className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-6">{idx + 1}.</span>
                <span className="text-sm text-white w-36 truncate">{player.name}</span>
                <span className="text-xs text-gray-400 w-28">{player.team}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(player.crosses / 215) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{player.crosses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SquadsTab() {
  const [sortBy, setSortBy] = useState<keyof typeof squadStats[0]>('goals');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedSquads = [...squadStats].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  });

  const handleSort = (key: keyof typeof squadStats[0]) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">👥 Estatísticas das Equipes</h2>
          <p className="text-gray-400 text-sm mt-1">Clique nos cabeçalhos para ordenar</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-3 py-3 text-left text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('team')}>
                  Equipe {sortBy === 'team' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('possession')}>
                  Posse% {sortBy === 'possession' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('goals')}>
                  Gols {sortBy === 'goals' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('assists')}>
                  Assist. {sortBy === 'assists' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('goalsPer90')}>
                  Gols/90 {sortBy === 'goalsPer90' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('shots')}>
                  Chutes {sortBy === 'shots' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('shotsOnTarget')}>
                  No Alvo {sortBy === 'shotsOnTarget' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('yellowCards')}>
                  CA {sortBy === 'yellowCards' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('redCards')}>
                  CV {sortBy === 'redCards' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('fouls')}>
                  Faltas {sortBy === 'fouls' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSquads.map((squad) => (
                <tr key={squad.team} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-3 py-3 font-medium text-white whitespace-nowrap">{squad.team}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      squad.possession >= 52 ? 'bg-green-900/50 text-green-400' :
                      squad.possession >= 48 ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {squad.possession}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-green-400">{squad.goals}</td>
                  <td className="px-3 py-3 text-center text-blue-400">{squad.assists}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{squad.goalsPer90.toFixed(2)}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{squad.shots}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{squad.shotsOnTarget}</td>
                  <td className="px-3 py-3 text-center text-yellow-400">{squad.yellowCards}</td>
                  <td className="px-3 py-3 text-center text-red-400">{squad.redCards}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{squad.fouls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Possession vs Goals Chart */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📊 Posse de Bola vs Gols Marcados</h3>
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-around gap-1 px-4">
            {[...squadStats]
              .sort((a, b) => b.goals - a.goals)
              .slice(0, 10)
              .map((squad) => (
                <div key={squad.team} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex justify-center" style={{ height: '200px' }}>
                    <div
                      className="absolute bottom-0 w-3/4 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-500"
                      style={{ height: `${(squad.goals / 52) * 100}%` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-green-400 font-bold">
                        {squad.goals}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 mt-2 truncate w-full text-center">{squad.team.slice(0, 8)}</span>
                  <span className="text-xs text-gray-500">{squad.possession}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DefendersTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">🛡️ Melhores Defensores - Série B 2026</h2>
          <p className="text-gray-400 text-sm mt-1">Líderes em desarmes e interceptações</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">#</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Jogador</th>
                <th className="px-4 py-3 text-left text-gray-300 font-medium">Equipe</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Desarmes</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Interceptações</th>
                <th className="px-4 py-3 text-center text-gray-300 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {topDefenders.map((player, idx) => (
                <tr key={player.name} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{player.name}</td>
                  <td className="px-4 py-3 text-gray-300">{player.team}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-400">{player.tacklesWon}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-400">{player.interceptions}</td>
                  <td className="px-4 py-3 text-center font-bold text-purple-400">{player.tacklesWon + player.interceptions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🦵 Desarmes (Tackles Won)</h3>
          <div className="space-y-3">
            {[...topDefenders].sort((a, b) => b.tacklesWon - a.tacklesWon).map((player, idx) => (
              <div key={player.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-6">{idx + 1}.</span>
                <span className="text-sm text-white w-32 truncate">{player.name}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(player.tacklesWon / 50) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{player.tacklesWon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🚧 Interceptações</h3>
          <div className="space-y-3">
            {[...topDefenders].sort((a, b) => b.interceptions - a.interceptions).map((player, idx) => (
              <div key={player.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-6">{idx + 1}.</span>
                <span className="text-sm text-white w-32 truncate">{player.name}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(player.interceptions / 50) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{player.interceptions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color, icon }: { title: string; value: string; subtitle: string; color: string; icon: string }) {
  const colorClasses: Record<string, string> = {
    green: 'from-green-800 to-green-900 border-green-700',
    yellow: 'from-yellow-800 to-yellow-900 border-yellow-700',
    blue: 'from-blue-800 to-blue-900 border-blue-700',
    red: 'from-red-800 to-red-900 border-red-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-5 border shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className="text-xl font-bold text-white mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function CriciumaTab() {
  const [sortBy, setSortBy] = useState<keyof typeof criciumaPlayers[0]>('minutesPlayed');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  const filteredPlayers = criciumaPlayers
    .filter(p => positionFilter === 'all' || p.position === positionFilter)
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });

  const handleSort = (key: keyof typeof criciumaPlayers[0]) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  const getPositionLabel = (pos: string) => {
    switch (pos) {
      case 'G': return { label: 'Goleiro', color: 'bg-yellow-600' };
      case 'D': return { label: 'Defensor', color: 'bg-blue-600' };
      case 'M': return { label: 'Meio-campo', color: 'bg-green-600' };
      case 'F': return { label: 'Atacante', color: 'bg-red-600' };
      default: return { label: pos, color: 'bg-gray-600' };
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'text-green-400 bg-green-900/50';
    if (rating >= 7.0) return 'text-green-300 bg-green-900/30';
    if (rating >= 6.5) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-6 border border-red-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🔴</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{criciumaTeamStats.team}</h2>
              <p className="text-red-200 text-sm">
                {criciumaTeamStats.season} • {criciumaTeamStats.position}º lugar • Técnico: {criciumaTeamStats.manager}
              </p>
              <p className="text-red-300 text-xs mt-1">
                Capitão: {criciumaTeamStats.captain} • Formação: {criciumaTeamStats.formation}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{criciumaTeamStats.points}</p>
              <p className="text-xs text-red-200">Pontos</p>
            </div>
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{criciumaTeamStats.goalsFor}</p>
              <p className="text-xs text-red-200">Gols</p>
            </div>
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{criciumaTeamStats.goalsAgainst}</p>
              <p className="text-xs text-red-200">Gols Sofridos</p>
            </div>
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">+{criciumaTeamStats.goalDiff}</p>
              <p className="text-xs text-red-200">Saldo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{criciumaTeamStats.wins}</p>
          <p className="text-sm text-gray-400">Vitórias</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{criciumaTeamStats.draws}</p>
          <p className="text-sm text-gray-400">Empates</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{criciumaTeamStats.losses}</p>
          <p className="text-sm text-gray-400">Derrotas</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{criciumaTeamStats.cleanSheets}</p>
          <p className="text-sm text-gray-400">Jogos Sem Sofrer Gol</p>
        </div>
      </div>

      {/* Position Filter */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400 mr-2">Filtrar por posição:</span>
          {[
            { id: 'all', label: 'Todos', color: 'bg-gray-600' },
            { id: 'G', label: '🧤 Goleiros', color: 'bg-yellow-600' },
            { id: 'D', label: '🛡️ Defensores', color: 'bg-blue-600' },
            { id: 'M', label: '🎯 Meio-campo', color: 'bg-green-600' },
            { id: 'F', label: '⚡ Atacantes', color: 'bg-red-600' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setPositionFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                positionFilter === filter.id
                  ? `${filter.color} text-white shadow-lg`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Player Stats Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">📊 Estatísticas Detalhadas dos Jogadores</h2>
          <p className="text-gray-400 text-sm mt-1">
            Dados de passes, toques e classificação • Clique nos cabeçalhos para ordenar
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-3 py-3 text-left text-gray-300 font-medium">Jogador</th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium">Pos</th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('totalPass')}
                >
                  Total Passes {sortBy === 'totalPass' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('accuratePass')}
                >
                  Passes Certos {sortBy === 'accuratePass' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-3 text-center text-gray-300 font-medium">Precisão%</th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('totalLongBalls')}
                >
                  Bolas Longas {sortBy === 'totalLongBalls' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('accurateLongBalls')}
                >
                  BL Certas {sortBy === 'accurateLongBalls' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('minutesPlayed')}
                >
                  Minutos {sortBy === 'minutesPlayed' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('touches')}
                >
                  Toques {sortBy === 'touches' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('rating')}
                >
                  Nota {sortBy === 'rating' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-3 py-3 text-center text-gray-300 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort('possessionLostCtrl')}
                >
                  Posse Perdida {sortBy === 'possessionLostCtrl' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => {
                const posInfo = getPositionLabel(player.position);
                return (
                  <tr key={player.name} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-6">#{player.jerseyNumber}</span>
                        <span className="font-medium text-white whitespace-nowrap">{player.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`${posInfo.color} text-white text-xs px-2 py-0.5 rounded font-medium`}>
                        {posInfo.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-white">{player.totalPass}</td>
                    <td className="px-3 py-3 text-center text-green-400">{player.accuratePass}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        player.accuratePassPercent >= 80 ? 'bg-green-900/50 text-green-400' :
                        player.accuratePassPercent >= 70 ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {player.accuratePassPercent}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-300">{player.totalLongBalls}</td>
                    <td className="px-3 py-3 text-center text-blue-400">{player.accurateLongBalls}</td>
                    <td className="px-3 py-3 text-center text-gray-300">{player.minutesPlayed}'</td>
                    <td className="px-3 py-3 text-center text-gray-300">{player.touches}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRatingColor(player.rating)}`}>
                        {player.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-orange-400">{player.possessionLostCtrl}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Accuracy Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Precisão de Passes (%)</h3>
          <div className="space-y-2">
            {[...filteredPlayers]
              .sort((a, b) => b.accuratePassPercent - a.accuratePassPercent)
              .slice(0, 10)
              .map((player) => (
                <div key={player.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-32 truncate">{player.name}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-2 ${
                        player.accuratePassPercent >= 80 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                        player.accuratePassPercent >= 70 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                        'bg-gradient-to-r from-red-600 to-red-400'
                      }`}
                      style={{ width: `${player.accuratePassPercent}%` }}
                    >
                      <span className="text-xs font-bold text-white">{player.accuratePassPercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Rating Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">⭐ Classificação (Rating)</h3>
          <div className="space-y-2">
            {[...filteredPlayers]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 10)
              .map((player) => (
                <div key={player.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-32 truncate">{player.name}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-2 ${
                        player.rating >= 7.0 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                        player.rating >= 6.5 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                        'bg-gradient-to-r from-red-600 to-red-400'
                      }`}
                      style={{ width: `${(player.rating / 10) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{player.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Long Balls Chart */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📐 Bolas Longas - Total vs Precisas</h3>
        <div className="space-y-3">
          {[...filteredPlayers]
            .sort((a, b) => b.totalLongBalls - a.totalLongBalls)
            .slice(0, 10)
            .map((player) => (
              <div key={player.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{player.name}</span>
                  <span className="text-xs text-gray-400">{player.totalLongBalls} total • {player.accurateLongBalls} certas</span>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                      style={{ width: `${(player.totalLongBalls / 285) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                      style={{ width: `${(player.accurateLongBalls / 142) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500"></span> Total Bolas Longas
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500"></span> Bolas Longas Certas
            </span>
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">📡 Fonte dos Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Minutos jogados e gols extraídos do <strong className="text-white">FBref.com</strong></p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Stats de passes no formato <strong className="text-white">SofaScore API</strong> (igual ao repositório)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Inclui: totalPass, accuratePass, totalLongBalls, accurateLongBalls, touches, rating, possessionLostCtrl</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <p>Dados do <strong className="text-white">Criciúma Esporte Clube</strong> na Série B 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
