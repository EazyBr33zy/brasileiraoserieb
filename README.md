# ⚽ Football Analytics Dashboard - Série B 2026

Dashboard interativo de análise de dados do Campeonato Brasileiro Série B 2026, com foco especial no **Criciúma Esporte Clube** e no jogador **Fellipe Mateus**.

## 🎯 Funcionalidades

### 📊 Visão Geral
- Cards com estatísticas principais da competição
- Gráficos de gols marcados por equipe
- Top 5 artilheiros, assistências e defensores
- Média de gols por partida

### 🏆 Classificação
- Tabela completa com todas as 20 equipes
- Zonas de acesso (G4) e rebaixamento destacadas
- Estatísticas detalhadas (J, V, E, D, GP, GC, SG, Pts)
- Artilheiros e goleiros de cada time

### ⚽ Artilheiros
- Top 10 goleadores da competição
- Estatísticas de finalização (chutes, no alvo, precisão)
- Comparação visual de gols vs chutes

### 🎯 Assistências
- Top 10 jogadores com mais assistências
- Líderes em cruzamentos
- Estatísticas de G+A (gols + assistências)

### 👥 Equipes
- Estatísticas completas de todas as equipes
- Tabelas ordenáveis por qualquer métrica
- Posse de bola, cartões, faltas
- Gráfico de posse vs gols

### 🛡️ Defensores
- Top 10 defensores por desarmes e interceptações
- Comparação visual de estatísticas defensivas

### 🔴 Criciúma
- Dashboard dedicado ao Criciúma Esporte Clube
- Estatísticas detalhadas de todos os jogadores
- Filtro por posição (Goleiro, Defensor, Meio-campo, Atacante)
- Métricas:
  - **Total Passes** (totalPass)
  - **Passes Certos** (accuratePass)
  - **Precisão %** de passes
  - **Bolas Longas** (totalLongBalls)
  - **Bolas Longas Certas** (accurateLongBalls)
  - **Minutos Jogados** (minutesPlayed)
  - **Toques** (touches)
  - **Classificação/Nota** (rating)
  - **Posse Perdida** (possessionLostCtrl)

### 🗺️ Mapa de Passes - Fellipe Mateus
- **Campo de futebol interativo** com direção dos passes
- **Passes certos em VERDE** ✓
- **Passes errados em VERMELHO** ✗
- Filtros por:
  - Tipo de passe (curto, médio, longo)
  - Mostrar/ocultar passes certos ou errados
- Estatísticas resumidas:
  - Total de passes e taxa de acerto
  - Passes por distância (curto, médio, longo)
  - Passes por direção (frente, trás, lateral)
- Hover sobre cada passe para ver detalhes
- Posição média do jogador marcada no campo

## 📡 Fonte dos Dados

Os dados foram extraídos via **web scraping** de:
- **FBref.com** - Estatísticas oficiais da Série B 2026
- **SofaScore API** - Formato dos dados de passes (coordenadas x,y)

### Estrutura dos Dados de Passes (SofaScore API)

```json
{
  "passes": [
    {
      "id": 1,
      "start": { "x": 45.2, "y": 52.8 },
      "end": { "x": 58.7, "y": 61.3 },
      "type": "accurate",
      "minute": 23,
      "length": 14.2
    }
  ]
}
```

**Coordenadas do campo:**
- `(0, 0)` = gol do Criciúma (esquerda)
- `(100, 100)` = gol adversário (direita, em cima)
- Campo de 0-100 em ambos os eixos

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS v4** - Estilização
- **SVG** - Renderização do campo de futebol
- **Dados reais** do FBref.com

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎨 Inspiração

Este projeto foi inspirado no repositório:
[Football-Analytics-Data-Engineering](https://github.com/hshariq/Football-Analytics-Data-Engineering)

Que utiliza web scraping da API do SofaScore para extrair dados de:
- Lineups e estatísticas de jogadores
- Passes com coordenadas
- Shots e heatmaps
- Posições médias

## 📊 Dados Incluídos

- **20 equipes** da Série B 2026
- **Classificação completa** com todas as rodadas
- **Top artilheiros** e assistências
- **27 jogadores** do Criciúma com stats detalhados
- **112 passes** do Fellipe Mateus com coordenadas
- Estatísticas defensivas, de posse e finalização

## 🏆 Destaques da Série B 2026

- **Líderes em gols**: Mikael (CRB) e Robson (Novorizontino) - 16 gols
- **Líder em assistências**: Romulo (Novorizontino) - 9 assistências
- **Criciúma**: 5º lugar com 50 pontos (14V, 8E, 8D)
- **Fellipe Mateus**: 4 gols, 1 assistência em 2096 minutos

## 📝 Licença

Projeto educacional para demonstração de web scraping e visualização de dados esportivos.

---

**Desenvolvido com ❤️ para análise de futebol brasileiro**
