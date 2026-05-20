# LGPD Compliance — SleepApp

## Dados Coletados e Base Legal

| Dado | Finalidade | Base Legal LGPD | Retenção |
|------|-----------|----------------|---------|
| Horário de dormir/acordar | Gerar plano de sono | Consentimento (Art. 7, I) | Até usuário excluir |
| Nível de cansaço/estresse | Personalização do plano | Consentimento | Até usuário excluir |
| Consumo de cafeína/álcool | Análise de qualidade do sono | Consentimento | Até usuário excluir |
| Score de sono calculado | Histórico e insights | Consentimento | Até usuário excluir |
| ID anônimo (UUID local) | Identificar sessão | Interesse legítimo | Permanente (não vinculado a PII) |

**Dados que NÃO coletamos:**
- Nome real, CPF, email
- Localização/GPS
- Contatos
- Dados biométricos

## Política de Retenção

- Todos os dados ficam **apenas no dispositivo** (AsyncStorage)
- Nenhum backup automático em nuvem na v1
- Dados enviados para Claude API: **apenas em tempo real**, não armazenados
- Logs do Lambda: apenas erros técnicos, sem conteúdo do usuário

## Implementação do Direito ao Esquecimento

O usuário pode apagar todos os dados via:

```
Perfil → Redefinir app → Confirmar
```

Isso chama `storageService.clearAll()` que executa:
```typescript
await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
```

Resultado: **100% dos dados removidos do dispositivo** em menos de 1 segundo.

## Termos Mínimos para App de Saúde

### Aviso obrigatório no onboarding
> "SleepApp não é um serviço médico. As recomendações são baseadas em higiene do sono e boas práticas de bem-estar. Consulte um médico se tiver problemas sérios de sono."

### Política de Privacidade (mínimo)
1. Quais dados coletamos (tabela acima)
2. Como usamos os dados
3. Com quem compartilhamos (Anthropic API — anonimizado)
4. Como o usuário pode exercer seus direitos
5. Contato do DPO (mesmo que informal): email do desenvolvedor

### Termos de Uso (mínimo)
1. Não é serviço médico
2. Não é substituto de tratamento profissional
3. Responsabilidade limitada
4. Política de reembolso (para assinaturas)

## Data Safety — Google Play (obrigatório)

### Seção "Dados coletados"
- **Saúde e Exercício**: Informações sobre sono (coletados, não compartilhados)
- **Identificadores de app**: ID anônimo (coletados, não compartilhados)

### Seção "Práticas de segurança"
- [x] Os dados são criptografados em trânsito
- [x] Você pode solicitar que os dados sejam excluídos
- [ ] ~~Os dados são vinculados à sua identidade~~ (NÃO — todos anônimos)

## Checklist de Conformidade

- [ ] Tela de consentimento no primeiro acesso com política resumida
- [ ] Botão "Redefinir app" funcional (direito ao esquecimento)
- [ ] Política de Privacidade acessível na tela de Perfil
- [ ] Termos de Uso acessíveis na tela de Perfil
- [ ] Data Safety preenchida no Play Console
- [ ] Aviso "não é serviço médico" visível no onboarding
- [ ] Logs do Lambda sem dados pessoais do usuário
- [ ] ANTHROPIC_API_KEY nunca exposta no código ou logs
