# SleepApp — Product Requirements Document

## Visão do Produto
SleepApp é um app mobile de melhora do sono com IA personalizada, focado no mercado brasileiro com expansão LATAM planejada. A proposta de valor central é: *"Em 14 dias, você vai dormir melhor — garantido pela IA."*

## Proposta de Valor
- Plano de sono personalizado gerado por IA em 2 minutos
- Sons ambiente para facilitar o adormecer
- Rastreamento diário com insights automáticos
- Linguagem acolhedora, sem jargão médico

## Personas

### Bruno, 32 — Profissional de TI Ansioso
Trabalha em remoto, dorme tarde, acorda cansado. Tem 2 monitores, cafeína às 22h, scroll infinito. Quer parar de depender de melatonina.

### Camila, 41 — Mãe e Executiva
Dorme 5h, acorda 2-3x por noite. Busca soluções rápidas que cabem na rotina. Pagaria por algo que "realmente funcione".

## Jobs to Be Done
- "Quero adormecer em menos de 20 minutos"
- "Quero parar de acordar no meio da noite"
- "Quero acordar com energia, não arrastado"
- "Quero entender o que está atrapalhando meu sono"

## User Stories — MoSCoW

### Must Have
- [ ] Como usuário, quero completar o onboarding em < 3 minutos
- [ ] Como usuário, quero receber um plano de sono personalizado pela IA
- [ ] Como usuário, quero reproduzir sons ambiente para dormir
- [ ] Como usuário, quero registrar como foi minha noite
- [ ] Como usuário, quero ver meu histórico de sono

### Should Have
- [ ] Como usuário, quero receber insights diários da IA
- [ ] Como usuário, quero ver meu score de sono com tendência semanal
- [ ] Como usuário, quero mudar o idioma do app

### Could Have
- [ ] Integração com wearables (Fitbit, Garmin)
- [ ] Comunidade de usuários
- [ ] Plano adaptativo semanal automático

### Won't Have (v1)
- Diagnóstico médico
- Integração com planos de saúde
- Modo offline completo

## Métricas de Sucesso
| Métrica | Meta 30 dias | Meta 90 dias |
|---------|-------------|-------------|
| DAU/MAU | > 35% | > 45% |
| Retenção D1 | > 60% | > 65% |
| Retenção D7 | > 30% | > 40% |
| Retenção D30 | > 15% | > 25% |
| Conversion free→premium | > 5% | > 8% |
| Onboarding completion | > 70% | > 75% |

## Critérios de Aceitação

### Onboarding
- Usuário completa Welcome → Profile → Goals → AIPlan em < 3 min
- Plano gerado em < 30s (ou erro claro com retry)
- Progresso salvo ao fechar app em qualquer ponto

### Sons
- Reprodução em background (tela bloqueada)
- Timer para auto-parar
- 3 sons grátis acessíveis sem login

### Tracker
- Registro salvo localmente em < 1s
- Score calculado instantaneamente
- Insight da IA exibido em < 15s
