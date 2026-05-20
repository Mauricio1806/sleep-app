# Beta Testing — Guia

## Configurar Google Play Internal Testing

1. Acesse Play Console → SleepApp → Testing → Internal testing
2. Crie uma release e faça upload do AAB de release
3. Adicione emails dos testers na lista "Internal testers"
4. Compartilhe o link de opt-in com os testers

## Como Convidar 50 Beta Testers

### Fontes de recrutamento
- Grupo de WhatsApp/Telegram pessoal (15-20 pessoas)
- LinkedIn: post pedindo voluntários (10-15 pessoas)
- Comunidades de bem-estar/produtividade no Discord (10-15 pessoas)
- Família e amigos diretos (5-10 pessoas)

### Critérios de seleção
- Smartphone Android 8.0+
- Algum problema de sono relatado
- Disposição para dar feedback estruturado
- Diversidade de perfis (idade, ocupação, horários)

## Formulário de Feedback Estruturado

```
=== SleepApp Beta Feedback ===
Data: ___/___/____
Versão testada: ___

1. Conseguiu completar o onboarding? (Sim/Não)
   Se não: onde travou? ___

2. O plano gerado pela IA fez sentido para você? (1-5)
   Comentário: ___

3. Você usou os sons para dormir? (Sim/Não)
   Qual som? ___

4. Registrou sua noite pelo menos 1x? (Sim/Não)

5. O que você mais gostou? ___

6. O que você mudaria? ___

7. Você pagaria R$ 19,90/mês pelo Premium? (Sim/Talvez/Não)
   Por quê? ___

8. Nota geral (1-10): ___
```

## Critérios para Avançar de Internal → Closed Testing

| Critério | Meta |
|---------|------|
| Crash-free sessions | > 99% |
| ANR rate | < 0.5% |
| Onboarding completion | > 65% |
| Feedbacks coletados | ≥ 30 |
| Nota média feedback | ≥ 7/10 |
| Bugs críticos abertos | 0 |

## Bugs Críticos (bloqueadores de release)
- App crasha no onboarding
- Plano de IA não é gerado (sem mensagem de erro)
- Sons não reproduzem em nenhum device
- Dados de registro não são salvos
- App não inicia

## Cronograma Sugerido
```
Semana 1: Internal testing (10 testers, equipe/amigos próximos)
Semana 2: Closed testing (50 testers recrutados)
Semana 3: Análise de feedback e correções
Semana 4: Open testing (qualquer um pode baixar)
Semana 5: Staged rollout para Production (10%)
```
