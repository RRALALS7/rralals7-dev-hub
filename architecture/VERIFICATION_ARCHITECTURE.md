# 🧱 Arquitetura — Roblox Rigid Verification

> Sistema de verificação rígida por Roblox para servidores Discord.

---

## Fluxo principal

```txt
Membro entra
↓
Recebe cargo Não Verificado
↓
Só vê canal de verificação
↓
Inicia verificação Roblox
↓
Bot gera código
↓
Usuário coloca código no perfil público Roblox
↓
Bot confirma
↓
Remove Não Verificado
↓
Adiciona Verificado
```

---

## Componentes

- cargo não verificado
- cargo verificado
- canal de verificação
- mensagem fixa com botão
- sistema de código
- logs da staff
- armazenamento local

---

## Segurança

O bot nunca deve pedir:

- senha
- token
- cookie
- autenticação privada

A verificação usa apenas dados públicos do perfil Roblox.

---

## Melhorias futuras

- tempo limite para verificar
- kick automático configurável
- auditoria por staff
- painel de configuração
- reset de verificação
- histórico de usernames

---

## Conclusão

Verificação rígida é boa quando é simples para o usuário e segura para o servidor.

> RRALALS7 sempre ajuda.
