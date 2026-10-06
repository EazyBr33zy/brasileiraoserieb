#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
⚽ Análise de Passes - Criciúma Esporte Clube
Campeonato Brasileiro Série B 2026

Script Python standalone para análise de passes com visualização interativa
Formato baseado no repositório Football-Analytics-Data-Engineering
"""

import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Arc
import seaborn as sns
import time
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Configurações de visualização
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette('viridis')

print("="*60)
print("⚽ ANÁLISE DE PASSES - CRICIÚMA ESPORTE CLUBE")
print("="*60)
print("Campeonato Brasileiro Série B 2026")
print("="*60 + "\n")

# ============================================================================
# CONFIGURAÇÃO DA API DO SOFASCORE
# ============================================================================

headers = {
    'authority': 'api.sofascore.com',
    'accept': '*/*',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'origin': 'https://www.sofascore.com',
    'referer': 'https://www.sofascore.com/',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
}
headers['If-Modified-Since'] = datetime.now().isoformat()

print("✅ Headers da API configurados\n")

# ============================================================================
# FUNÇÕES DE WEB SCRAPING
# ============================================================================

def get_team_id(team_name='Criciuma'):
    """Busca o ID do time Criciúma na API do SofaScore"""
    url = f'https://api.sofascore.com/api/v1/teams/search/{team_name}'
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            teams = data.get('teams', [])
            for team in teams:
                if 'Crici' in team.get('name', ''):
                    print(f"✅ Time encontrado: {team['name']} (ID: {team['id']})")
                    return team['id']
        print('❌ Time não encontrado')
        return None
    except Exception as e:
        print(f'❌ Erro ao buscar time: {e}')
        return None

def get_team_events(team_id):
    """Busca todos os eventos (jogos) do time na temporada"""
    url = f'https://api.sofascore.com/api/v1/team/{team_id}/events/last/0'
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            events = data.get('events', [])
            print(f'✅ {len(events)} jogos encontrados')
            return events
        return []
    except Exception as e:
        print(f'❌ Erro ao buscar eventos: {e}')
        return []

def get_event_lineups(event_id):
    """Busca lineups e estatísticas de um jogo específico"""
    url = f'https://api.sofascore.com/api/v1/event/{event_id}/lineups'
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f'❌ Erro ao buscar lineups: {e}')
        return None

print("✅ Funções de scraping definidas\n")

# ============================================================================
# GERAÇÃO DE DADOS REALÍSTICOS
# ============================================================================

def generate_realistic_passes(player_name, position, num_passes=50):
    """
    Gera dados realistas de passes baseados na posição do jogador
    """
    np.random.seed(hash(player_name) % 2**32)
    
    passes = []
    
    # Definir área de atuação baseada na posição
    if position == 'G':  # Goleiro
        x_range = (5, 20)
        y_range = (30, 70)
        accuracy = 0.75
    elif position == 'D':  # Defensor
        x_range = (15, 40)
        y_range = (10, 90)
        accuracy = 0.82
    elif position == 'M':  # Meio-campista
        x_range = (30, 65)
        y_range = (15, 85)
        accuracy = 0.85
    else:  # Atacante
        x_range = (55, 90)
        y_range = (20, 80)
        accuracy = 0.78
    
    for i in range(num_passes):
        # Posição inicial
        start_x = np.random.uniform(x_range[0], x_range[1])
        start_y = np.random.uniform(y_range[0], y_range[1])
        
        # Distância e ângulo do passe
        distance = np.random.exponential(15) + 5
        angle = np.random.uniform(0, 2 * np.pi)
        
        # Posição final
        end_x = start_x + distance * np.cos(angle)
        end_y = start_y + distance * np.sin(angle)
        
        # Limitar ao campo
        end_x = np.clip(end_x, 0, 100)
        end_y = np.clip(end_y, 0, 100)
        
        # Determinar se foi preciso
        accurate = np.random.random() < accuracy
        
        passes.append({
            'id': i + 1,
            'startX': start_x,
            'startY': start_y,
            'endX': end_x,
            'endY': end_y,
            'accurate': accurate,
            'minute': np.random.randint(1, 91),
            'length': np.sqrt((end_x - start_x)**2 + (end_y - start_y)**2)
        })
    
    return passes

# ============================================================================
# VISUALIZAÇÃO DO CAMPO
# ============================================================================

def plot_football_field(ax=None):
    """Desenha um campo de futebol completo"""
    if ax is None:
        fig, ax = plt.subplots(figsize=(12, 8))
    
    # Campo principal
    field = patches.Rectangle((0, 0), 100, 100, linewidth=2, edgecolor='white', facecolor='#2d5a27')
    ax.add_patch(field)
    
    # Linha do meio
    ax.plot([50, 50], [0, 100], color='white', linewidth=2)
    
    # Círculo central
    circle = plt.Circle((50, 50), 9, fill=False, color='white', linewidth=2)
    ax.add_patch(circle)
    ax.plot(50, 50, 'o', color='white', markersize=4)
    
    # Áreas grandes (esquerda)
    penalty_left = patches.Rectangle((0, 20), 16, 60, fill=False, edgecolor='white', linewidth=2)
    ax.add_patch(penalty_left)
    
    # Áreas pequenas (esquerda)
    goal_left = patches.Rectangle((0, 35), 6, 30, fill=False, edgecolor='white', linewidth=2)
    ax.add_patch(goal_left)
    
    # Áreas grandes (direita)
    penalty_right = patches.Rectangle((84, 20), 16, 60, fill=False, edgecolor='white', linewidth=2)
    ax.add_patch(penalty_right)
    
    # Áreas pequenas (direita)
    goal_right = patches.Rectangle((94, 35), 6, 30, fill=False, edgecolor='white', linewidth=2)
    ax.add_patch(goal_right)
    
    # Arcos de escanteio
    ax.add_patch(Arc((0, 0), 2, 2, angle=0, theta1=0, theta2=90, color='white', linewidth=2))
    ax.add_patch(Arc((100, 0), 2, 2, angle=0, theta1=90, theta2=180, color='white', linewidth=2))
    ax.add_patch(Arc((0, 100), 2, 2, angle=0, theta1=270, theta2=360, color='white', linewidth=2))
    ax.add_patch(Arc((100, 100), 2, 2, angle=0, theta1=180, theta2=270, color='white', linewidth=2))
    
    # Gols
    ax.plot([0, 0], [45, 55], color='white', linewidth=3)
    ax.plot([100, 100], [45, 55], color='white', linewidth=3)
    
    # Configurações do plot
    ax.set_xlim(-2, 102)
    ax.set_ylim(-2, 102)
    ax.set_aspect('equal')
    ax.axis('off')
    
    return ax

# ============================================================================
# VISUALIZAÇÃO DE PASSES
# ============================================================================

def plot_player_passes(player_name, passes, position, show_accurate=True, show_inaccurate=True):
    """Plota os passes de um jogador específico no campo"""
    
    # Filtrar passes
    filtered_passes = [
        p for p in passes
        if (show_accurate and p['accurate']) or (show_inaccurate and not p['accurate'])
    ]
    
    # Criar figura
    fig, ax = plt.subplots(figsize=(14, 9))
    
    # Desenhar campo
    plot_football_field(ax)
    
    # Plotar passes
    for pass_data in filtered_passes:
        color = '#22c55e' if pass_data['accurate'] else '#ef4444'
        alpha = 0.6
        
        # Linha do passe
        ax.annotate(
            '',
            xy=(pass_data['endX'], pass_data['endY']),
            xytext=(pass_data['startX'], pass_data['startY']),
            arrowprops=dict(
                arrowstyle='->',
                color=color,
                lw=1.5,
                alpha=alpha
            )
        )
        
        # Ponto de início
        ax.plot(pass_data['startX'], pass_data['startY'], 'o', 
                color=color, markersize=3, alpha=alpha)
    
    # Posição média do jogador
    if passes:
        avg_x = np.mean([p['startX'] for p in passes])
        avg_y = np.mean([p['startY'] for p in passes])
        ax.plot(avg_x, avg_y, 'o', color='yellow', markersize=12, 
                markeredgecolor='white', markeredgewidth=2, zorder=10)
    
    # Título e estatísticas
    accurate_count = sum(1 for p in filtered_passes if p['accurate'])
    inaccurate_count = len(filtered_passes) - accurate_count
    accuracy = (accurate_count / len(filtered_passes) * 100) if filtered_passes else 0
    
    title = f'{player_name} - {position}\n'
    title += f'Total: {len(filtered_passes)} passes | '
    title += f'Certos: {accurate_count} | Errados: {inaccurate_count} | '
    title += f'Precisão: {accuracy:.1f}%'
    
    ax.set_title(title, fontsize=14, fontweight='bold', pad=20, color='white')
    
    # Legenda
    legend_elements = [
        plt.Line2D([0], [0], color='#22c55e', lw=2, label='Passe Certo'),
        plt.Line2D([0], [0], color='#ef4444', lw=2, label='Passe Errado'),
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='yellow', 
                   markersize=10, label='Posição Média')
    ]
    ax.legend(handles=legend_elements, loc='upper right', 
              facecolor='black', edgecolor='white', labelcolor='white')
    
    plt.tight_layout()
    plt.show()

# ============================================================================
# ESTATÍSTICAS
# ============================================================================

def show_player_stats(player_name, passes, position):
    """Mostra estatísticas detalhadas de um jogador"""
    
    total = len(passes)
    accurate = sum(1 for p in passes if p['accurate'])
    inaccurate = total - accurate
    accuracy = (accurate / total * 100) if total > 0 else 0
    
    # Por distância
    short = sum(1 for p in passes if p['length'] < 15)
    medium = sum(1 for p in passes if 15 <= p['length'] < 30)
    long_passes = sum(1 for p in passes if p['length'] >= 30)
    
    # Por direção
    forward = sum(1 for p in passes if p['endX'] > p['startX'])
    backward = sum(1 for p in passes if p['endX'] < p['startX'])
    lateral = sum(1 for p in passes if abs(p['endX'] - p['startX']) < 5)
    
    # Médias
    avg_length = np.mean([p['length'] for p in passes]) if passes else 0
    
    print(f'\n{"="*60}')
    print(f'📊 ESTATÍSTICAS DETALHADAS - {player_name}')
    print(f'{"="*60}')
    print(f'Posição: {position}')
    print(f'\n📈 GERAIS:')
    print(f'  Total de Passes: {total}')
    print(f'  Passes Certos: {accurate} ({accuracy:.1f}%)')
    print(f'  Passes Errados: {inaccurate} ({100-accuracy:.1f}%)')
    print(f'  Distância Média: {avg_length:.1f}')
    print(f'\n📏 POR DISTÂNCIA:')
    print(f'  Curtos (<15): {short} ({short/total*100:.1f}%)')
    print(f'  Médios (15-30): {medium} ({medium/total*100:.1f}%)')
    print(f'  Longos (30+): {long_passes} ({long_passes/total*100:.1f}%)')
    print(f'\n🧭 POR DIREÇÃO:')
    print(f'  Para Frente: {forward} ({forward/total*100:.1f}%)')
    print(f'  Para Trás: {backward} ({backward/total*100:.1f}%)')
    print(f'  Laterais: {lateral} ({lateral/total*100:.1f}%)')
    print(f'{"="*60}\n')

# ============================================================================
# MAIN
# ============================================================================

def main():
    """Função principal"""
    
    # Lista de jogadores do Criciúma (dados reais do FBref)
    players_list = [
        ('Airton Moraes', 'G'),
        ('Marcelo Hermes', 'M'),
        ('Luciano Castán', 'D'),
        ('César', 'D'),
        ('Rodrigo Fagundes', 'D'),
        ('Guilherme Lobo', 'M'),
        ('Fellipe Mateus', 'M'),
        ('Waguinho', 'F'),
        ('Rómulo Otero', 'F'),
        ('Willean Lepo', 'M'),
        ('Eduardo', 'M'),
        ('Bruno Fabiano Alves', 'D'),
        ('Marcinho', 'M'),
        ('Nicolas', 'F'),
        ('Jhonata Robert', 'M'),
        ('Diego Gonçalves', 'M'),
        ('Ronald', 'M'),
        ('Pedro Santos', 'G'),
        ('Ruan Carvalho', 'D'),
        ('Romarinho', 'M'),
        ('Thiaguinho', 'M'),
        ('Jean', 'M'),
        ('Cauê', 'F'),
        ('Alisson', 'G'),
        ('Yuri Jonathan', 'F'),
        ('Hiago', 'D'),
        ('João Carlos', 'F'),
    ]
    
    print("🎲 Gerando dados de passes para todos os jogadores...\n")
    
    # Gerar dados de passes
    players_data = {}
    for player_name, position in players_list:
        num_passes = np.random.randint(30, 80)
        players_data[player_name] = {
            'name': player_name,
            'position': position,
            'passes': generate_realistic_passes(player_name, position, num_passes)
        }
    
    print(f'✅ Dados gerados para {len(players_data)} jogadores\n')
    
    # Criar DataFrame com resumo
    players_summary = []
    for player_name, player_info in players_data.items():
        passes = player_info['passes']
        accurate = sum(1 for p in passes if p['accurate'])
        
        players_summary.append({
            'Nome': player_name,
            'Posição': player_info['position'],
            'Total Passes': len(passes),
            'Passes Certos': accurate,
            'Passes Errados': len(passes) - accurate,
            'Precisão %': (accurate / len(passes) * 100) if len(passes) > 0 else 0,
            'Média Distância': np.mean([p['length'] for p in passes]) if passes else 0
        })
    
    df_players = pd.DataFrame(players_summary)
    df_players = df_players.sort_values('Total Passes', ascending=False)
    
    print('👥 Top 10 Jogadores (por total de passes):\n')
    print(df_players.head(10).to_string(index=False))
    
    # Menu interativo
    while True:
        print('\n' + '='*60)
        print('🎮 MENU INTERATIVO')
        print('='*60)
        print('1. Visualizar passes de um jogador')
        print('2. Ver estatísticas de um jogador')
        print('3. Ver top 10 por precisão')
        print('4. Gráfico comparativo')
        print('5. Exportar dados para CSV')
        print('0. Sair')
        print('='*60)
        
        choice = input('\nEscolha uma opção (0-5): ').strip()
        
        if choice == '0':
            print('\n👋 Até logo!')
            break
        
        elif choice == '1':
            print('\n👥 Lista de jogadores:')
            for idx, name in enumerate(players_data.keys(), 1):
                print(f'{idx}. {name}')
            
            player_idx = int(input('\nEscolha o número do jogador: ')) - 1
            player_name = list(players_data.keys())[player_idx]
            player_info = players_data[player_name]
            
            print('\nFiltros:')
            show_acc = input('Mostrar passes certos? (s/n): ').lower() == 's'
            show_inacc = input('Mostrar passes errados? (s/n): ').lower() == 's'
            
            plot_player_passes(
                player_name,
                player_info['passes'],
                player_info['position'],
                show_accurate=show_acc,
                show_inaccurate=show_inacc
            )
        
        elif choice == '2':
            print('\n👥 Lista de jogadores:')
            for idx, name in enumerate(players_data.keys(), 1):
                print(f'{idx}. {name}')
            
            player_idx = int(input('\nEscolha o número do jogador: ')) - 1
            player_name = list(players_data.keys())[player_idx]
            player_info = players_data[player_name]
            
            show_player_stats(
                player_name,
                player_info['passes'],
                player_info['position']
            )
        
        elif choice == '3':
            print('\n🏆 Top 10 Jogadores por Precisão:\n')
            top_accuracy = df_players.sort_values('Precisão %', ascending=False).head(10)
            print(top_accuracy[['Nome', 'Posição', 'Precisão %', 'Total Passes']].to_string(index=False))
        
        elif choice == '4':
            # Gráfico de precisão
            fig, ax = plt.subplots(figsize=(12, 8))
            
            top_players = df_players.head(15)
            colors = ['#22c55e' if p >= 80 else '#eab308' if p >= 70 else '#ef4444' 
                      for p in top_players['Precisão %']]
            
            bars = ax.barh(range(len(top_players)), top_players['Precisão %'], color=colors)
            ax.set_yticks(range(len(top_players)))
            ax.set_yticklabels(top_players['Nome'])
            ax.set_xlabel('Precisão (%)', fontsize=12, fontweight='bold')
            ax.set_title('Top 15 Jogadores - Precisão de Passes', fontsize=14, fontweight='bold')
            ax.axvline(x=80, color='green', linestyle='--', alpha=0.5, label='Excelente (80%)')
            ax.axvline(x=70, color='yellow', linestyle='--', alpha=0.5, label='Bom (70%)')
            ax.legend()
            ax.grid(axis='x', alpha=0.3)
            
            # Adicionar valores nas barras
            for i, (bar, value) in enumerate(zip(bars, top_players['Precisão %'])):
                ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2, 
                        f'{value:.1f}%', va='center', fontsize=9)
            
            plt.tight_layout()
            plt.show()
        
        elif choice == '5':
            # Exportar dados
            df_players.to_csv('criciuma_players_stats.csv', index=False, encoding='utf-8-sig')
            print('✅ Dados exportados para: criciuma_players_stats.csv')
            
            # Exportar passes
            all_passes_data = []
            for player_name, player_info in players_data.items():
                for pass_data in player_info['passes']:
                    all_passes_data.append({
                        'player_name': player_name,
                        'position': player_info['position'],
                        'pass_id': pass_data['id'],
                        'startX': pass_data['startX'],
                        'startY': pass_data['startY'],
                        'endX': pass_data['endX'],
                        'endY': pass_data['endY'],
                        'accurate': pass_data['accurate'],
                        'minute': pass_data['minute'],
                        'length': pass_data['length']
                    })
            
            df_passes = pd.DataFrame(all_passes_data)
            df_passes.to_csv('criciuma_all_passes.csv', index=False, encoding='utf-8-sig')
            print('✅ Dados de passes exportados para: criciuma_all_passes.csv')
        
        else:
            print('\n❌ Opção inválida!')

if __name__ == '__main__':
    main()
