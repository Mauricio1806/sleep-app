# AWS Architecture — SleepApp

## Diagrama Textual

```
[React Native App]
       │
       ├─ AsyncStorage (local, offline-first)
       │
       └─ HTTPS ──► [Lambda Function URL] ──► [Anthropic API]
                           │
                    (claude-proxy)
                           │
                    CloudWatch Logs

[S3 Bucket]
  └─ sons/ (8 arquivos MP3, público GET)
       └─ CloudFront CDN (opcional fase 2)
```

## Recursos por Fase

### MVP (0–500 usuários)
| Recurso | Configuração | Custo estimado/mês |
|---------|-------------|-------------------|
| Lambda | 256MB, timeout 35s | ~$0 (free tier) |
| S3 | Bucket único, us-east-1 | ~$0.50 |
| CloudWatch | Logs básicos | ~$0 |
| **Total** | | **~$0.50 + API calls** |

### Fase 2 (500–5k usuários)
| Recurso | Configuração | Custo estimado/mês |
|---------|-------------|-------------------|
| Lambda | Concurrency reservada 10 | ~$15 |
| S3 + CloudFront | CDN global | ~$5 |
| RDS PostgreSQL | db.t3.micro | ~$15 |
| Secrets Manager | API keys | ~$1 |
| **Total** | | **~$36 + API calls** |

### Fase 3 (5k–50k usuários)
| Recurso | Configuração | Custo estimado/mês |
|---------|-------------|-------------------|
| Lambda | Auto-scaling | ~$80 |
| RDS | db.t3.small Multi-AZ | ~$60 |
| CloudFront | 1TB transfer | ~$85 |
| ElastiCache Redis | cache.t3.micro | ~$15 |
| **Total** | | **~$240 + API calls** |

## Configuração Multi-Região LATAM

```
Primary:   us-east-1 (N. Virginia) — BR, CO, MX
Secondary: sa-east-1 (São Paulo)   — BR (baixa latência)
```

### Lambda Edge para sons
```
CloudFront Origins:
  - us-east-1: s3://sleepapp-sounds-prod
  - sa-east-1: s3://sleepapp-sounds-prod-sa (réplica)
```

## Checklist de Segurança e LGPD

### API Keys
- [ ] ANTHROPIC_API_KEY em Secrets Manager (não no código)
- [ ] Lambda só tem acesso ao seu próprio secret
- [ ] Rotação de keys a cada 90 dias

### Dados de Usuário
- [ ] Nenhum dado PII enviado para Lambda (apenas scores anônimos)
- [ ] AsyncStorage criptografado (Keychain/Keystore nativos)
- [ ] User ID é UUID local sem vínculo a CPF/email

### LGPD
- [ ] Direito ao esquecimento: `clearAll()` apaga tudo localmente
- [ ] Retenção: dados locais, sem backup em nuvem na v1
- [ ] Consentimento explícito no onboarding para uso de IA

### Lambda
- [ ] VPC não necessária (stateless, sem acesso a DB)
- [ ] Timeout máximo 35s (proteção contra custos)
- [ ] Sem logs de conteúdo de usuários (apenas erros)
