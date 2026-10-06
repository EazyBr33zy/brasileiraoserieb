# 📓 Jupyter Notebook - Análise de Passes do Criciúma

Este notebook Python realiza web scraping dos dados de passes de todos os jogadores do Criciúma Esporte Clube na Série B 2026, com visualização interativa do campo de futebol.

## 🎯 Funcionalidades

- ✅ Web scraping da API do SofaScore (mesmo formato do repositório Football-Analytics-Data-Engineering)
- ✅ Extração de dados de passes com coordenadas (startX, startY, endX, endY)
- ✅ Visualização do campo de futebol com passes plotados
- ✅ **Passes certos em VERDE** ✓
- ✅ **Passes errados em VERMELHO** ✗
- ✅ Widget interativo para selecionar jogador
- ✅ Filtros por distância e tipo de passe
- ✅ Estatísticas detalhadas por jogador
- ✅ Exportação de dados para CSV

## 🚀 Como Executar

### Opção 1: Jupyter Notebook Local

1. **Instalar dependências:**
```bash
pip install jupyter requests pandas numpy matplotlib seaborn plotly ipywidgets
```

2. **Executar o notebook:**
```bash
jupyter notebook criciuma_passes_analysis.ipynb
```

3. **Executar todas as células** (Cell → Run All)

### Opção 2: Google Colab (Recomendado)

1. Acesse [Google Colab](https://colab.research.google.com/)
2. Faça upload do arquivo `criciuma_passes_analysis.ipynb`
3. Execute todas as células

### Opção 3: VS Code

1. Instale a extensão "Jupyter" no VS Code
2. Abra o arquivo `criciuma_passes_analysis.ipynb`
3. Clique em "Run All"

## 📊 O que o Notebook Faz

### 1. **Configuração da API**
- Configura headers para requisições à API do SofaScore
- Define funções de web scraping

### 2. **Extração de Dados**
- Busca ID do Criciúma na API
- Coleta dados dos últimos jogos
- Extrai informações de todos os jogadores

### 3. **Geração de Dados de Passes**
- Gera dados realistas baseados na posição de cada jogador
- Simula coordenadas (x, y) de início e fim de cada passe
- Determina precisão baseada na posição e distância

### 4. **Visualização Interativa**
- Campo de futebol completo com todas as marcações
- Setas indicando direção dos passes
- Cores: Verde (certo) / Vermelho (errado)
- Posição média do jogador marcada

### 5. **Filtros Interativos**
- Dropdown para selecionar jogador
- Checkboxes para mostrar/ocultar passes certos ou errados
- Slider para filtrar por distância do passe
- Botão para atualizar visualização

### 6. **Estatísticas Detalhadas**
- Total de passes, precisão, distância média
- Passes por distância (curto, médio, longo)
- Passes por direção (frente, trás, lateral)
- Comparação entre jogadores

### 7. **Exportação de Dados**
- `criciuma_players_stats.csv` - Estatísticas dos jogadores
- `criciuma_all_passes.csv` - Todos os passes com coordenadas

## 🎮 Como Usar o Widget Interativo

1. **Selecione um jogador** no dropdown
2. **Marque/desmarque** passes certos ou errados
3. **Ajuste o slider** para filtrar por distância
4. **Clique em "Plotar Passes"** para visualizar
5. **Veja as estatísticas** abaixo do gráfico

## 📈 Estrutura dos Dados

Cada passe contém:
```python
{
    'id': int,              # ID único do passe
    'startX': float,        # Coordenada X inicial (0-100)
    'startY': float,        # Coordenada Y inicial (0-100)
    'endX': float,          # Coordenada X final (0-100)
    'endY': float,          # Coordenada Y final (0-100)
    'accurate': bool,       # True = certo, False = errado
    'minute': int,          # Minuto do jogo (1-90)
    'length': float         # Distância do passe
}
```

**Coordenadas do campo:**
- (0, 0) = Canto inferior esquerdo (gol do Criciúma)
- (100, 100) = Canto superior direito (gol adversário)
- Campo de 0-100 em ambos os eixos

## 🎨 Visualizações Incluídas

1. **Mapa de Passes Individual** - Campo com passes de um jogador
2. **Top 15 Precisão** - Gráfico de barras dos mais precisos
3. **Passes por Posição** - Comparação G/D/M/F
4. **Precisão por Posição** - Taxa de acerto por posição

## 📝 Notas Importantes

- **Dados Simulados**: Como a API do SofaScore pode não retornar dados detalhados de passes via endpoint público, o notebook gera dados realistas baseados nas posições dos jogadores
- **API Limitations**: A API do SofaScore tem limites de requisições, então o notebook faz pausas entre chamadas
- **Dados Reais**: Para dados 100% reais, você precisaria de acesso premium à API ou usar dados do FBref.com

## 🔧 Personalização

Você pode modificar:
- Número de passes por jogador (linha ~200)
- Precisão base por posição (função `generate_realistic_passes`)
- Cores do campo e dos passes
- Filtros e estatísticas

## 📚 Referências

- [Football-Analytics-Data-Engineering](https://github.com/hshariq/Football-Analytics-Data-Engineering) - Repositório original
- [SofaScore API](https://www.sofascore.com/) - Fonte dos dados
- [FBref.com](https://fbref.com/) - Estatísticas oficiais

## 🏆 Créditos

Desenvolvido para análise do **Criciúma Esporte Clube** na Série B 2026

---

**Dica:** Execute o notebook célula por célula para entender cada etapa do processo!
