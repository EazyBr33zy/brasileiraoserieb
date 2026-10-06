import { useState } from 'react';
import { fellipeMateusPasses, fellipeMateusPassStats, PassData } from '../data/fellipeMateusPasses';

export default function PassMap() {
  const [hoveredPass, setHoveredPass] = useState<PassData | null>(null);
  const [showAccurate, setShowAccurate] = useState(true);
  const [showInaccurate, setShowInaccurate] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  const filteredPasses = fellipeMateusPasses.filter(p => {
    const typeMatch = filterType === 'all' ||
      (filterType === 'short' && p.length < 15) ||
      (filterType === 'medium' && p.length >= 15 && p.length < 30) ||
      (filterType === 'long' && p.length >= 30);
    const accuracyMatch = (showAccurate && p.accurate) || (showInaccurate && !p.accurate);
    return typeMatch && accuracyMatch;
  });

  // SVG field dimensions
  const fieldWidth = 800;
  const fieldHeight = 520;
  const padding = 40;

  // Convert data coordinates (0-100) to SVG coordinates
  const toSvgX = (x: number) => padding + (x / 100) * (fieldWidth - 2 * padding);
  const toSvgY = (y: number) => padding + ((100 - y) / 100) * (fieldHeight - 2 * padding);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-6 border border-red-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🗺️</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mapa de Passes - Fellipe Mateus</h2>
              <p className="text-red-200 text-sm">
                Criciúma Esporte Clube • Série B 2026 • Formato SofaScore API
              </p>
              <p className="text-red-300 text-xs mt-1">
                Dados de direção de passes com coordenadas x,y (start → end)
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{fellipeMateusPassStats.totalPasses}</p>
              <p className="text-xs text-red-200">Total Passes</p>
            </div>
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-green-400">{fellipeMateusPassStats.accuratePasses}</p>
              <p className="text-xs text-red-200">Certos</p>
            </div>
            <div className="bg-black/20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-red-400">{fellipeMateusPassStats.inaccuratePasses}</p>
              <p className="text-xs text-red-200">Errados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filtros:</span>
            <button
              onClick={() => setShowAccurate(!showAccurate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                showAccurate ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Passes Certos ({fellipeMateusPassStats.accuratePasses})
            </button>
            <button
              onClick={() => setShowInaccurate(!showInaccurate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                showInaccurate ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Passes Errados ({fellipeMateusPassStats.inaccuratePasses})
            </button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-400">Distância:</span>
            {[
              { id: 'all' as const, label: 'Todos' },
              { id: 'short' as const, label: 'Curto (<15)' },
              { id: 'medium' as const, label: 'Médio (15-30)' },
              { id: 'long' as const, label: 'Longo (30+)' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Football Field SVG */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">🏟️ Campo de Futebol - Direção dos Passes</h3>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${fieldWidth} ${fieldHeight}`}
            className="w-full max-w-4xl mx-auto"
            style={{ minWidth: '600px' }}
          >
            {/* Field background */}
            <rect
              x={padding}
              y={padding}
              width={fieldWidth - 2 * padding}
              height={fieldHeight - 2 * padding}
              fill="#2d5a27"
              stroke="white"
              strokeWidth="2"
            />

            {/* Field stripes (grass pattern) */}
            {Array.from({ length: 10 }).map((_, i) => (
              <rect
                key={i}
                x={padding + (i * (fieldWidth - 2 * padding)) / 10}
                y={padding}
                width={(fieldWidth - 2 * padding) / 10}
                height={fieldHeight - 2 * padding}
                fill={i % 2 === 0 ? '#2d5a27' : '#357a2e'}
                opacity="0.5"
              />
            ))}

            {/* Center line */}
            <line
              x1={fieldWidth / 2}
              y1={padding}
              x2={fieldWidth / 2}
              y2={fieldHeight - padding}
              stroke="white"
              strokeWidth="2"
            />

            {/* Center circle */}
            <circle
              cx={fieldWidth / 2}
              cy={fieldHeight / 2}
              r={50}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx={fieldWidth / 2}
              cy={fieldHeight / 2}
              r={3}
              fill="white"
            />

            {/* Left penalty area */}
            <rect
              x={padding}
              y={padding + (fieldHeight - 2 * padding) * 0.2}
              width={(fieldWidth - 2 * padding) * 0.15}
              height={(fieldHeight - 2 * padding) * 0.6}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            {/* Left goal area */}
            <rect
              x={padding}
              y={padding + (fieldHeight - 2 * padding) * 0.35}
              width={(fieldWidth - 2 * padding) * 0.06}
              height={(fieldHeight - 2 * padding) * 0.3}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            {/* Left penalty spot */}
            <circle
              cx={padding + (fieldWidth - 2 * padding) * 0.11}
              cy={fieldHeight / 2}
              r={3}
              fill="white"
            />

            {/* Right penalty area */}
            <rect
              x={fieldWidth - padding - (fieldWidth - 2 * padding) * 0.15}
              y={padding + (fieldHeight - 2 * padding) * 0.2}
              width={(fieldWidth - 2 * padding) * 0.15}
              height={(fieldHeight - 2 * padding) * 0.6}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            {/* Right goal area */}
            <rect
              x={fieldWidth - padding - (fieldWidth - 2 * padding) * 0.06}
              y={padding + (fieldHeight - 2 * padding) * 0.35}
              width={(fieldWidth - 2 * padding) * 0.06}
              height={(fieldHeight - 2 * padding) * 0.3}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            {/* Right penalty spot */}
            <circle
              cx={fieldWidth - padding - (fieldWidth - 2 * padding) * 0.11}
              cy={fieldHeight / 2}
              r={3}
              fill="white"
            />

            {/* Corner arcs */}
            <path d={`M ${padding} ${padding + 10} A 10 10 0 0 1 ${padding + 10} ${padding}`} fill="none" stroke="white" strokeWidth="2" />
            <path d={`M ${fieldWidth - padding - 10} ${padding} A 10 10 0 0 1 ${fieldWidth - padding} ${padding + 10}`} fill="none" stroke="white" strokeWidth="2" />
            <path d={`M ${padding} ${fieldHeight - padding - 10} A 10 10 0 0 0 ${padding + 10} ${fieldHeight - padding}`} fill="none" stroke="white" strokeWidth="2" />
            <path d={`M ${fieldWidth - padding - 10} ${fieldHeight - padding} A 10 10 0 0 0 ${fieldWidth - padding} ${fieldHeight - padding - 10}`} fill="none" stroke="white" strokeWidth="2" />

            {/* Goals */}
            <rect
              x={padding - 10}
              y={fieldHeight / 2 - 30}
              width={10}
              height={60}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <rect
              x={fieldWidth - padding}
              y={fieldHeight / 2 - 30}
              width={10}
              height={60}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />

            {/* Pass lines */}
            {filteredPasses.map((pass) => {
              const x1 = toSvgX(pass.startX);
              const y1 = toSvgY(pass.startY);
              const x2 = toSvgX(pass.endX);
              const y2 = toSvgY(pass.endY);
              const isHovered = hoveredPass?.id === pass.id;
              const color = pass.accurate ? '#22c55e' : '#ef4444';
              const opacity = isHovered ? 1 : 0.6;
              const strokeWidth = isHovered ? 3 : 1.5;

              // Calculate arrow head
              const angle = Math.atan2(y2 - y1, x2 - x1);
              const arrowLength = 8;
              const arrowX = x2 - Math.cos(angle) * arrowLength;
              const arrowY = y2 - Math.sin(angle) * arrowLength;

              return (
                <g
                  key={pass.id}
                  onMouseEnter={() => setHoveredPass(pass)}
                  onMouseLeave={() => setHoveredPass(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pass line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    strokeLinecap="round"
                  />
                  {/* Arrow head */}
                  <polygon
                    points={`${x2},${y2} ${arrowX - Math.sin(angle) * 4},${arrowY + Math.cos(angle) * 4} ${arrowX + Math.sin(angle) * 4},${arrowY - Math.cos(angle) * 4}`}
                    fill={color}
                    opacity={opacity}
                  />
                  {/* Start dot */}
                  <circle
                    cx={x1}
                    cy={y1}
                    r={isHovered ? 4 : 2}
                    fill={color}
                    opacity={opacity}
                  />
                </g>
              );
            })}

            {/* Player position marker (average position) */}
            <circle
              cx={toSvgX(47)}
              cy={toSvgY(50)}
              r={8}
              fill="#fbbf24"
              stroke="white"
              strokeWidth="2"
              opacity="0.9"
            />
            <text
              x={toSvgX(47)}
              y={toSvgY(50) - 12}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
            >
              Fellipe Mateus
            </text>
            <text
              x={toSvgX(47)}
              y={toSvgY(50) + 4}
              textAnchor="middle"
              fill="black"
              fontSize="8"
              fontWeight="bold"
            >
              #10
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-500 rounded"></div>
            <span className="text-gray-300">Passe Certo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-red-500 rounded"></div>
            <span className="text-gray-300">Passe Errado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
            <span className="text-gray-300">Posição Média do Jogador</span>
          </div>
        </div>

        {/* Hover info */}
        {hoveredPass && (
          <div className="mt-4 bg-gray-700 rounded-lg p-3 text-sm">
            <p className="text-white font-medium">Passe #{hoveredPass.id} - {hoveredPass.minute}'</p>
            <p className="text-gray-300">
              De ({hoveredPass.startX.toFixed(1)}, {hoveredPass.startY.toFixed(1)}) →
              Para ({hoveredPass.endX.toFixed(1)}, {hoveredPass.endY.toFixed(1)})
            </p>
            <p className={`font-medium ${hoveredPass.accurate ? 'text-green-400' : 'text-red-400'}`}>
              {hoveredPass.accurate ? '✓ Passe Certo' : '✗ Passe Errado'} • Distância: {hoveredPass.length.toFixed(1)}
            </p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">📊 Por Distância</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passes Curtos (&lt;15)</span>
              <span className="text-white font-bold">{fellipeMateusPassStats.shortPasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passes Médios (15-30)</span>
              <span className="text-white font-bold">{fellipeMateusPassStats.mediumPasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passes Longos (30+)</span>
              <span className="text-white font-bold">{fellipeMateusPassStats.longPasses}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
              <span className="text-gray-300">Média de Distância</span>
              <span className="text-blue-400 font-bold">{fellipeMateusPassStats.avgPassLength}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🧭 Por Direção</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passes Para Frente</span>
              <span className="text-green-400 font-bold">{fellipeMateusPassStats.forwardPasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passes Para Trás</span>
              <span className="text-yellow-400 font-bold">{fellipeMateusPassStats.backwardPasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passes Laterais</span>
              <span className="text-blue-400 font-bold">{fellipeMateusPassStats.lateralPasses}</span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="flex gap-1 h-4 rounded overflow-hidden">
                <div
                  className="bg-green-500"
                  style={{ width: `${(fellipeMateusPassStats.forwardPasses / fellipeMateusPassStats.totalPasses) * 100}%` }}
                  title="Para frente"
                />
                <div
                  className="bg-yellow-500"
                  style={{ width: `${(fellipeMateusPassStats.lateralPasses / fellipeMateusPassStats.totalPasses) * 100}%` }}
                  title="Laterais"
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${(fellipeMateusPassStats.backwardPasses / fellipeMateusPassStats.totalPasses) * 100}%` }}
                  title="Para trás"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Precisão</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total de Passes</span>
              <span className="text-white font-bold">{fellipeMateusPassStats.totalPasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-400">Passes Certos</span>
              <span className="text-green-400 font-bold">{fellipeMateusPassStats.accuratePasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400">Passes Errados</span>
              <span className="text-red-400 font-bold">{fellipeMateusPassStats.inaccuratePasses}</span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">Taxa de Acerto:</span>
                <span className="text-2xl font-bold text-white">{fellipeMateusPassStats.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                  style={{ width: `${fellipeMateusPassStats.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Structure Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">📡 Estrutura dos Dados (SofaScore API)</h3>
        <p className="text-gray-400 text-sm mb-4">
          Formato idêntico ao repositório Football-Analytics-Data-Engineering (Webscrap-Passing.ipynb)
        </p>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre>{`{
  "passes": [
    {
      "id": 1,
      "start": { "x": 45.2, "y": 52.8 },    // posição inicial (0-100)
      "end":   { "x": 58.7, "y": 61.3 },    // posição final (0-100)
      "type":  "accurate",                   // "accurate" | "inaccurate"
      "minute": 23,
      "length": 14.2
    },
    ...
  ]
}

// Coordenadas do campo:
// (0,0)   = gol do Criciúma (esquerda)
// (100,0) = gol adversário (direita, embaixo)
// (0,100) = canto superior esquerdo
// (100,100) = canto superior direito`}</pre>
        </div>
      </div>
    </div>
  );
}
