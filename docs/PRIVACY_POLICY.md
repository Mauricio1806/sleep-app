# Política de Privacidade — Sona

**Última atualização:** maio de 2026

## 1. Quem somos

Sona é um aplicativo de higiene do sono desenvolvido para o mercado LATAM. Esta política descreve como coletamos, usamos e protegemos seus dados.

## 2. Dados coletados

- **Perfil de sono:** horários de dormir/acordar, nível de cansaço, estresse, consumo de cafeína e tempo de tela. Inseridos voluntariamente por você.
- **Registros de sono:** dados de qualidade, duração, acordadas e notas opcionais.
- **Intenções de memória:** textos que você escreve para consolidação de memória.
- **Identificador anônimo:** um ID gerado localmente, sem vínculo com seu nome ou e-mail.

## 3. Como usamos seus dados

- Gerar seu plano personalizado de 14 dias usando inteligência artificial (Anthropic Claude). Seus dados de perfil são enviados ao nosso servidor seguro (AWS EC2) para processamento. Não armazenamos seu perfil em servidores permanentes — ele é processado em tempo real e descartado.
- Exibir histórico e insights localmente no seu dispositivo.

## 4. Armazenamento

Todos os seus registros são armazenados **localmente no seu dispositivo** via AsyncStorage. Não mantemos banco de dados centralizado com seus dados pessoais.

## 5. Compartilhamento

Não vendemos, alugamos nem compartilhamos seus dados com terceiros, exceto:
- **Anthropic (EUA):** seu perfil de sono (sem identificação pessoal) é processado para geração do plano via API. Consulte a [política de privacidade da Anthropic](https://www.anthropic.com/privacy).
- **Amazon Web Services:** infraestrutura de servidor intermediário (sem armazenamento persistente dos seus dados).

## 6. Seus direitos (LGPD / Lei 13.709/2018)

Você tem direito a:
- **Acesso:** saber quais dados estão no seu dispositivo.
- **Exclusão:** use o botão "Restaurar app" em Perfil → Conta para apagar todos os dados locais.
- **Portabilidade:** função de exportação disponível em versões futuras.

Para usuários na América Latina, aplicamos os mesmos princípios da LGPD brasileira.

## 7. Crianças

O Sona não é destinado a menores de 13 anos. Não coletamos dados de crianças intencionalmente.

## 8. Segurança

A comunicação com nosso servidor utiliza HTTPS. Sua chave de API da Anthropic nunca é exposta no aplicativo.

## 9. Contato

Dúvidas? Entre em contato: **mauricio.esquivel1806@gmail.com**

---

*Esta política pode ser atualizada. Alterações significativas serão notificadas dentro do app.*
