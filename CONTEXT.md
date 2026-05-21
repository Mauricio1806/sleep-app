# SleepApp — Contexto permanente do projeto

## Stack
React Native 0.73 bare, TypeScript estrito, sem Expo
Caminho: C:\Users\mauri\Videos\data-engineering-workspace\SleepApp
GitHub: https://github.com/Mauricio1806/sleep-app

## Infraestrutura
- AWS S3: sons ambientes (bucket: sleep-app-audios-mauricio, us-east-1)
- AWS Lambda: proxy Claude API (Function URL configurada)
- Supabase: banco de dados (a conectar na Fase 2)
- RevenueCat: assinaturas (a conectar na Fase 2)
- Claude API: claude-sonnet-4-5, chave via Config.ANTHROPIC_API_KEY

## Status atual
MVP funcional rodando no emulador Pixel 7 API 36.
Onboarding 4 telas OK, Claude API gerando planos OK.
Sons com URLs placeholder (aguardando S3).
react-native-sound substituiu react-native-track-player.

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
