// Dados simulados de passes do Fellipe Mateus - Criciúma SC
// Baseado na estrutura da API do SofaScore (Webscrap-Passing.ipynb)
// Cada passe tem: start (x,y), end (x,y), type (accurate/inaccurate)
// Coordenadas: campo de 0-100 em ambos eixos
// (0,0) = canto inferior esquerdo do gol do Criciúma
// (100,100) = canto superior direito do gol adversário
// Fellipe Mateus joga como MF/FW, então seus passes vêm principalmente do meio-campo

export interface PassData {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  accurate: boolean;
  minute?: number;
  length: number;
}

// Função para gerar passes realistas baseados na posição do jogador
function generateFellipeMateusPasses(): PassData[] {
  const passes: PassData[] = [];
  let id = 1;

  // Fellipe Mateus atua principalmente entre x=30-70, y=20-80
  // Como meio-campista ofensivo, ele distribui jogo e faz passes progressivos

  // Passes curtos no meio-campo (mais frequentes, maior precisão)
  for (let i = 0; i < 45; i++) {
    const startX = 35 + Math.random() * 25; // 35-60
    const startY = 25 + Math.random() * 50; // 25-75
    const angle = Math.random() * Math.PI * 2;
    const distance = 5 + Math.random() * 12;
    const endX = Math.max(0, Math.min(100, startX + Math.cos(angle) * distance));
    const endY = Math.max(0, Math.min(100, startY + Math.sin(angle) * distance));
    const accurate = Math.random() < 0.85; // 85% de precisão em passes curtos
    passes.push({
      id: id++,
      startX,
      startY,
      endX,
      endY,
      accurate,
      minute: Math.floor(Math.random() * 90) + 1,
      length: distance,
    });
  }

  // Passes médios (distribuição de jogo)
  for (let i = 0; i < 30; i++) {
    const startX = 30 + Math.random() * 30; // 30-60
    const startY = 20 + Math.random() * 60; // 20-80
    // Tende a passar para frente e para as pontas
    const forwardBias = Math.random() < 0.6 ? 1 : -0.3;
    const endX = Math.max(0, Math.min(100, startX + (Math.random() * 20 + 5) * forwardBias));
    const endY = Math.max(0, Math.min(100, startY + (Math.random() - 0.5) * 30));
    const accurate = Math.random() < 0.72; // 72% de precisão
    passes.push({
      id: id++,
      startX,
      startY,
      endX,
      endY,
      accurate,
      minute: Math.floor(Math.random() * 90) + 1,
      length: Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)),
    });
  }

  // Passes longos / bolas lançadas
  for (let i = 0; i < 15; i++) {
    const startX = 30 + Math.random() * 25; // 30-55
    const startY = 25 + Math.random() * 50; // 25-75
    // Lançamentos para frente
    const endX = Math.max(0, Math.min(100, startX + 20 + Math.random() * 30));
    const endY = Math.max(5, Math.min(95, startY + (Math.random() - 0.5) * 40));
    const accurate = Math.random() < 0.55; // 55% de precisão em passes longos
    passes.push({
      id: id++,
      startX,
      startY,
      endX,
      endY,
      accurate,
      minute: Math.floor(Math.random() * 90) + 1,
      length: Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)),
    });
  }

  // Passes para as pontas (cruzamentos laterais)
  for (let i = 0; i < 12; i++) {
    const startX = 50 + Math.random() * 20; // 50-70
    const isRightSide = Math.random() < 0.5;
    const startY = isRightSide ? 60 + Math.random() * 25 : 15 + Math.random() * 25;
    const endX = 70 + Math.random() * 25; // 70-95
    const endY = isRightSide ? 70 + Math.random() * 25 : 5 + Math.random() * 25;
    const accurate = Math.random() < 0.60;
    passes.push({
      id: id++,
      startX,
      startY,
      endX,
      endY,
      accurate,
      minute: Math.floor(Math.random() * 90) + 1,
      length: Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)),
    });
  }

  // Passes para trás (recuo)
  for (let i = 0; i < 10; i++) {
    const startX = 45 + Math.random() * 20; // 45-65
    const startY = 30 + Math.random() * 40; // 30-70
    const endX = startX - 10 - Math.random() * 15; // recua
    const endY = startY + (Math.random() - 0.5) * 20;
    const accurate = Math.random() < 0.90; // alta precisão no recuo
    passes.push({
      id: id++,
      startX: Math.max(0, startX),
      startY: Math.max(0, Math.min(100, startY)),
      endX: Math.max(0, endX),
      endY: Math.max(0, Math.min(100, endY)),
      accurate,
      minute: Math.floor(Math.random() * 90) + 1,
      length: Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)),
    });
  }

  return passes;
}

export const fellipeMateusPasses = generateFellipeMateusPasses();

// Estatísticas resumidas
export const fellipeMateusPassStats = {
  totalPasses: fellipeMateusPasses.length,
  accuratePasses: fellipeMateusPasses.filter(p => p.accurate).length,
  inaccuratePasses: fellipeMateusPasses.filter(p => !p.accurate).length,
  accuracy: ((fellipeMateusPasses.filter(p => p.accurate).length / fellipeMateusPasses.length) * 100).toFixed(1),
  avgPassLength: (fellipeMateusPasses.reduce((sum, p) => sum + p.length, 0) / fellipeMateusPasses.length).toFixed(1),
  shortPasses: fellipeMateusPasses.filter(p => p.length < 15).length,
  mediumPasses: fellipeMateusPasses.filter(p => p.length >= 15 && p.length < 30).length,
  longPasses: fellipeMateusPasses.filter(p => p.length >= 30).length,
  forwardPasses: fellipeMateusPasses.filter(p => p.endX > p.startX).length,
  backwardPasses: fellipeMateusPasses.filter(p => p.endX < p.startX).length,
  lateralPasses: fellipeMateusPasses.filter(p => Math.abs(p.endX - p.startX) < 5).length,
};
