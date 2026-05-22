# SleepApp — Contexto permanente do projeto

## Stack
React Native 0.73 bare, TypeScript estrito, sem Expo
Caminho: C:\Users\mauri\Videos\data-engineering-workspace\SleepApp
GitHub: https://github.com/Mauricio1806/sleep-app

## Infraestrutura
- AWS S3: sons ambientes (bucket: sleep-app-audios-mauricio, us-east-1)
  - Scripts prontos: infrastructure/scripts/setup-s3-complete.ps1 e upload-sounds.ps1
- AWS EC2: backend Express (infrastructure/ec2/) — IP: 13.220.143.229
  - Endpoints: POST /api/v1/sleep/plan | /insight | /adjust | /memory/consolidation-tip | GET /health
  - PM2 cluster 2 instâncias, Nginx reverse proxy, UFW firewall
  - Deploy: bash infrastructure/scripts/deploy-ec2.sh 13.220.143.229 sleep-app-key.pem
  - Conectar: pwsh infrastructure/ec2/scripts/connect.ps1
  - Key: C:\Users\mauri\Videos\data-engineering-workspace\sleep-app-key.pem
- Supabase: banco de dados (a conectar na Fase 2)
- RevenueCat: assinaturas (a conectar na Fase 2)
- Claude API: proxied via EC2 — app não acessa Anthropic diretamente
  - claudeService.ts aponta para http://13.220.143.229/api/v1/

## Telas (5 tabs)
🏠 Home | 🎵 Sons (16 sons, 6 grátis) | 🌙 Registrar | 🧠 Memória | 👤 Perfil

## Status atual
MVP funcional rodando no emulador Pixel 7 API 36.
Onboarding 4 telas OK, planos gerados via EC2 backend (não mais direto à Anthropic).
claudeService.ts reescrito: postToEC2() → /api/v1/sleep/plan e /api/v1/sleep/insight.
ANTHROPIC_API_KEY removida do app — fica só no EC2.
Sons com URLs placeholder S3 (aguardando upload-sounds.ps1).
react-native-sound substituiu react-native-track-player.
MemoryScreen.tsx criada: intenção noturna + revisão matinal + dica científica + streak 7 dias.
Menções à IA/AI removidas de todos os 10 locales (subtitle, cta, summaryLabel).

## Regras inegociáveis
- Zero any no TypeScript
- Zero strings hardcoded fora de i18n/
- Toda rede via services/
- Toda persistência via storageService
- useNativeDriver: true em animações
- Máximo 300 linhas por arquivo

## Estratégia LATAM
Expansão em fases por país. Não é só idioma:
- Moeda local (BRL, MXN, ARS, COP, CLP, PEN, etc)
- Preço ajustado por PPP (poder de compra)
- Meio de pagamento local (Pix BR, OXXO MX, PSE CO, etc)
- Regulação fiscal por país (NF, CFDI, etc)
- Idioma e dialeto regional
Fase 1: Brasil (BRL, Pix, PT-BR) — FOCO ATUAL
Fase 2: México e Colômbia
Fase 3: demais países LATAM

## Preços definidos
BR: R$19,90/mês ou R$149,90/ano
MX: $99 MXN/mês (a implementar Fase 2)
CO: $15.000 COP/mês (a implementar Fase 2)
AR: $2.500 ARS/mês (a implementar Fase 2)
CL: $2.500 CLP/mês (a implementar Fase 2)
