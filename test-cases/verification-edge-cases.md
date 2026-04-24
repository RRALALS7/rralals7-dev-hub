# 🧪 Casos de Teste — Verificação Roblox

> Testes para o Roblox Rigid Verification.

---

## Casos principais

| Caso | Resultado esperado |
|---|---|
| usuário entra no servidor | recebe Não Verificado |
| usuário usa verificação correta | recebe Verificado |
| código não está no perfil | não verifica |
| username inexistente | erro amigável |
| usuário já verificado | mostrar status |
| usuário tenta verificar outra conta | exige novo fluxo/reset |

---

## Segurança

O bot deve recusar qualquer pedido envolvendo:

- senha
- token
- cookie
- login privado

---

## Permissões

Testar se o bot consegue:

- criar canal
- criar cargo
- gerenciar cargo
- enviar mensagem fixa
- remover cargo Não Verificado
- adicionar cargo Verificado

---

## Conclusão

Verificação precisa ser rígida para o servidor, mas simples para o usuário.
