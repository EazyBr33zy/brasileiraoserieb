# 🚀 GUIA RÁPIDO - Análise de Passes do Criciúma

## 📦 Arquivos Criados

1. **`criciuma_passes_analysis.ipynb`** - Jupyter Notebook completo com interface interativa
2. **`criciuma_passes_standalone.py`** - Script Python standalone com menu interativo
3. **`README_NOTEBOOK.md`** - Documentação detalhada do notebook

## ⚡ COMO EXECUTAR (Escolha uma opção)

### Opção 1: Jupyter Notebook (RECOMENDADO) ⭐

```bash
# 1. Instalar dependências
pip install jupyter requests pandas numpy matplotlib seaborn plotly ipywidgets

# 2. Executar o notebook
jupyter notebook criciuma_passes_analysis.ipynb

# 3. No navegador, clique em "Cell" → "Run All"
```

**Vantagens:**
- ✅ Interface gráfica interativa
- ✅ Widgets para selecionar jogador
- ✅ Visualizações em tempo real
- ✅ Fácil de modificar

---

### Opção 2: Script Python Standalone

```bash
# 1. Instalar dependências
pip install requests pandas numpy matplotlib seaborn

# 2. Executar o script
python criciuma_passes_standalone.py

# 3. Siga o menu interativo no terminal
```

**Vantagens:**
- ✅ Não precisa de Jupyter
- ✅ Menu interativo no terminal
- ✅ Mais leve

---

### Opção 3: Google Colab (ONLINE) 🌐

1. Acesse: https://colab.research.google.com/
2. Faça upload do arquivo `criciuma_passes_analysis.ipynb`
3. Execute todas as células

**Vantagens:**
- ✅ Não precisa instalar nada
- ✅ Roda no navegador
- ✅ Gratuito

---

## 🎮 O QUE VOCÊ PODE FAZER

### No Jupyter Notebook:

1. **Selecionar jogador** no dropdown
2. **Filtrar passes** (certos/errados, distância)
3. **Visualizar no campo** com setas coloridas
4. **Ver estatísticas** detalhadas
5. **Comparar jogadores** em gráficos
6. **Exportar dados** para CSV

### No Script Python:

1. Ver lista de todos os jogadores
2. Escolher jogador pelo número
3. Visualizar passes no campo
4. Ver estatísticas completas
5. Ver rankings (precisão, total)
6. Exportar dados

---

## 🎨 VISUALIZAÇÕES INCLUÍDAS

### 1. Mapa de Passes
- Campo de futebol completo
- **Passes certos em VERDE** ✓
- **Passes errados em VERMELHO** ✗
- Setas indicando direção
- Posição média do jogador

### 2. Gráficos Estatísticos
- Top 15 por precisão
- Passes por posição (G/D/M/F)
- Precisão por posição
- Comparação entre jogadores

### 3. Estatísticas Detalhadas
- Total de passes
- Taxa de acerto
- Passes por distância (curto/médio/longo)
- Passes por direção (frente/trás/lateral)
- Distância média

---

## 📊 DADOS INCLUÍDOS

**27 jogadores do Criciúma:**
- Goleiros: Airton Moraes, Pedro Santos, Alisson
- Defensores: Luciano Castán, César, Rodrigo Fagundes, etc.
- Meio-campistas: Marcelo Hermes, Fellipe Mateus, Guilherme Lobo, etc.
- Atacantes: Waguinho, Rómulo Otero, Nicolas, etc.

**Para cada jogador:**
- 30-80 passes simulados
- Coordenadas (startX, startY, endX, endY)
- Precisão baseada na posição
- Minuto do jogo
- Distância do passe

---

## 💡 DICAS

### Para modificar o número de passes:
```python
# No notebook, procure por:
num_passes = np.random.randint(30, 80)

# Altere para:
num_passes = np.random.randint(50, 100)  # Mais passes
```

### Para mudar a precisão:
```python
# Na função generate_realistic_passes:
if position == 'M':  # Meio-campista
    accuracy = 0.85  # 85% de precisão
    
# Altere para:
    accuracy = 0.90  # 90% de precisão
```

### Para adicionar mais jogadores:
```python
# Na lista players_list:
players_list = [
    ('Nome do Jogador', 'Posição'),  # G, D, M ou F
    # ...
]
```

---

## 📁 ARQUIVOS GERADOS

Após executar, você terá:

1. **`criciuma_players_stats.csv`** - Estatísticas dos jogadores
2. **`criciuma_all_passes.csv`** - Todos os passes com coordenadas

**Estrutura do CSV de passes:**
```
player_name,position,pass_id,startX,startY,endX,endY,accurate,minute,length
Fellipe Mateus,M,1,45.2,52.8,58.7,61.3,True,23,14.2
```

---

## 🔧 PROBLEMAS COMUNS

### "ModuleNotFoundError"
```bash
pip install -r requirements.txt
# ou
pip install jupyter requests pandas numpy matplotlib seaborn plotly ipywidgets
```

### "API não responde"
- A API do SofaScore pode ter limites
- O notebook gera dados realistas automaticamente
- Para dados 100% reais, use dados do FBref.com

### "Gráficos não aparecem"
```bash
# No Jupyter, adicione no início:
%matplotlib inline
```

---

## 🎯 PRÓXIMOS PASSOS

Depois de executar, você pode:

1. **Analisar padrões** de passes por minuto
2. **Criar heatmaps** de distribuição
3. **Comparar** desempenho em casa vs fora
4. **Calcular** passes progressivos
5. **Analisar** construção de jogadas

---

## 📚 REFERÊNCIAS

- [Football-Analytics-Data-Engineering](https://github.com/hshariq/Football-Analytics-Data-Engineering)
- [SofaScore API](https://www.sofascore.com/)
- [FBref.com](https://fbref.com/)

---

## 🏆 CRÉDITOS

Desenvolvido para análise do **Criciúma Esporte Clube**  
Campeonato Brasileiro Série B 2026

---

**Dúvidas?** Consulte o `README_NOTEBOOK.md` para documentação completa!
