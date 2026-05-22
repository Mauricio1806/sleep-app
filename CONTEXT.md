# Sona — Contexto permanente do projeto

## Stack
React Native 0.73 bare, TypeScript estrito, sem Expo
Caminho: C:\Users\mauri\Videos\data-engineering-workspace\SleepApp
GitHub: https://github.com/Mauricio1806/sleep-app

## Infraestrutura
- AWS S3: sons ambientes (bucket: sleep-app-audios-mauricio, us-east-1)
  - Scripts prontos: infrastructure/scripts/setup-s3-complete.ps1 e upload-sounds.ps1
- AWS EC2: backend Express (infrastructure/ec2/) — IP: 13.220.143.229
  - Endpoints: POST /api/v1/sleep/plan | /insight | /adjust | /memory/consolidation-tip | GET /health | GET /stats
  - PM2 cluster 2 instâncias, Nginx reverse proxy, UFW firewall
  - Deploy: bash infrastructure/scripts/deploy-ec2.sh 13.220.143.229 sleep-app-key.pem
  - Conectar: pwsh infrastructure/ec2/scripts/connect.ps1
  - Key: C:\Users\mauri\Videos\data-engineering-workspace\sleep-app-key.pem
- Supabase: banco de dados (a conectar na Fase 2)
- RevenueCat: assinaturas (a conectar na Fase 2)
- Claude API: proxied via EC2 — app não acessa Anthropic diretamente
  - claudeService.ts aponta para http://13.220.143.229/api/v1/

## Telas (5 tabs)
🏠 Início | 🎵 Sons (30 sons, 10 grátis, 6 categorias) | 🌙 Registrar | 🧠 Memória | 👤 Perfil
Tab labels traduzidos via i18n (tabs.home/sounds/tracker/memory/profile).

## Status atual
App renomeado: SleepApp → Sona (package.json, app.json, strings.xml).
MVP funcional rodando no emulador Pixel 7 API 36.
Onboarding 4 telas OK, planos gerados via EC2 backend.
claudeService.ts: postToEC2() → /api/v1/sleep/plan e /api/v1/sleep/insight.
ANTHROPIC_API_KEY removida do app — fica só no EC2.

EC2 backend (infrastructure/ec2/):
- Cache em memória por plano (Map, TTL 24h, chave hash do perfil)
- max_tokens reduzidos: plan=2000, insight=300, memory=200
- GET /api/v1/stats → { totalCalls, cacheHits, tokensSaved, uptime }

Correções beta aplicadas:
- Idioma padrão: sempre PT-BR; chave isolada @sleepapp:user_selected_locale; muda só por escolha manual na ProfileScreen.
- i18n fallback: se chave ausente no locale ativo, retorna PT-BR (nunca undefined).
- Auditoria strings: AIPlanScreen.tsx loading messages e firstDaysTitle agora via t(); SoundCard badges via i18n.
- SoundPlayerScreen reescrito: 30 sons em 6 categorias (Natureza/Sons Brancos/ASMR/Ambientes/Corpo/Especial), tabs horizontais, grid 2 colunas, bottom player.
- Todos soundNames e soundCategories em todos os 10 locales.
- SoundOption usa nameKey (i18n) + categoryId — zero strings hardcoded.
- Erros de rede tipados: ApiErrorType ('network'|'api'|'parse'|'timeout'), SleepApiError class, AIPlanScreen exibe mensagem correta por tipo.
- errors.timeoutError adicionado nos 10 locales.
- Onboarding draft: SleepProfileScreen e GoalsScreen salvam/restauram draft em @sleepapp:onboarding_draft; limpo ao gerar plano.
- docs/PRIVACY_POLICY.md e docs/TERMS_OF_USE.md criados.

Sons com URLs placeholder S3 (aguardando upload-sounds.ps1).
react-native-sound substituiu react-native-track-player.
MemoryScreen.tsx: intenção noturna + revisão matinal + dica científica + streak 7 dias.

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
