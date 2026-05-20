# LATAM Expansion Strategy

## Análise de Mercado

### Brasil (BR) — Mercado Principal
- 215M habitantes, 87% com smartphone
- Mercado de apps de saúde: US$800M (2024)
- Concorrência: Sleep Cycle, Calm (sem forte localização PT-BR)
- Vantagem: conteúdo 100% em PT-BR nativo

### México (MX) — Fase 2 (T3 2025)
- 130M habitantes, app economy crescendo 18% a.a.
- Preferência: tú informal, conteúdo em espanhol mexicano
- Pagamento: OXXO Pay, Mercado Pago, cartão doméstico

### Argentina (AR) — Fase 2 (T4 2025)
- 46M habitantes, alto uso de streaming e apps de saúde
- Vos (2ª pessoa singular única)
- Alta inflação: preço em USD ou indexado ao dólar
- Pagamento: MercadoPago dominante

### Colômbia (CO) — Fase 3 (T1 2026)
- 52M habitantes, Bogotá como hub tech LATAM
- Usted (formal) preferido em contextos de saúde
- Pagamento: PSE, Nequi, Daviplata

### Chile (CL) — Fase 3 (T2 2026)
- 19M habitantes, maior renda per capita LATAM
- Espanhol chileno, tú informal
- Pagamento: Webpay, Transbank

## Diferenças Culturais que Afetam o Produto

| Aspecto | BR | MX | AR | CO |
|---------|----|----|----|----|
| Tratamento | você | tú | vos | usted |
| Horário de dormir médio | 23:30 | 23:00 | 00:30 | 22:30 |
| Sensibilidade a preço | Média | Alta | Muito Alta | Alta |
| Método de pagamento | Pix/cartão | OXXO/cartão | MP/cartão | PSE/Nequi |

## Estratégia de Preço (PPP-adjusted)
| País | Moeda | Mensal | Anual |
|------|-------|--------|-------|
| Brasil | BRL | R$ 19,90 | R$ 159,90 |
| México | MXN | $ 99 | $ 799 |
| Argentina | ARS | $ 2.500 | $ 19.900 |
| Colômbia | COP | $ 15.000 | $ 119.000 |
| Chile | CLP | $ 2.500 | $ 19.900 |

## Parceiros de Pagamento
- **BR**: Stripe + Pix nativo
- **MX**: Conekta ou Stripe MX
- **AR**: MercadoPago
- **CO**: PayU LATAM
- **CL**: Transbank + Webpay

## Roadmap de Expansão
```
Q2 2025: Brasil MVP + beta testing
Q3 2025: México (ES-MX strings + Conekta)
Q4 2025: Argentina (ES-AR + MercadoPago)
Q1 2026: Colômbia (ES-CO + PayU)
Q2 2026: Chile (ES-CL + Transbank)
```

## Considerações Técnicas por País
- A/B test de conversão por país (feature flag `isPremiumEnabled`)
- CDN com edge nodes em SA-EAST-1 (São Paulo) e US-EAST-1
- LGPD (BR), LFPDPPP (MX), Ley 25.326 (AR), Ley 1581 (CO)
