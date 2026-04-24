# 🧱 Ideias de Roblox Utils

> Utilitários focados em dados públicos, organização de comunidades e projetos legalizados.

---

## 14. Roblox Public Lookup Bot

**Descrição:** bot que consulta informações públicas de perfis Roblox.

**Stack sugerida:** Node.js, discord.js, APIs públicas Roblox

**Dificuldade:** Média

**Recursos principais:**
- Buscar por username
- Mostrar avatar
- Exibir user ID
- Link do perfil
- Informações públicas disponíveis

**Roadmap:**
1. Criar comando `/roblox user`
2. Consultar API pública
3. Formatar embed
4. Adicionar tratamento de erro
5. Criar cache simples

**Cuidados:** não pedir senha, cookie, token ou dados privados.

---

## 15. Bot de Verificação Roblox

**Descrição:** sistema para confirmar que um membro Discord possui determinada conta Roblox.

**Stack sugerida:** Node.js, discord.js, SQLite, APIs públicas Roblox

**Dificuldade:** Média

**Recursos principais:**
- Código de verificação
- Checagem pública no perfil
- Cargo automático
- Logs de verificação
- Re-verificação manual

**Roadmap:**
1. Gerar código único
2. Orientar usuário a colocar código em local público permitido
3. Verificar código
4. Vincular Discord ID ao Roblox ID
5. Aplicar cargo

**Cuidados:** nunca pedir credenciais do Roblox.

---

## 16. Sistema de Whitelist Roblox

**Descrição:** painel simples para controlar quem pode acessar experiências, grupos ou eventos privados.

**Stack sugerida:** Node.js, Express, SQLite/Airtable

**Dificuldade:** Média

**Recursos principais:**
- Lista de usuários autorizados
- Busca por Roblox ID
- Registro de staff
- Exportação JSON
- Histórico de mudanças

**Roadmap:**
1. Criar banco de whitelist
2. Criar formulário de cadastro
3. Validar dados públicos
4. Exportar lista
5. Criar painel administrativo

**Cuidados:** não usar para perseguição, doxxing ou exclusão abusiva.

---

## 17. Dashboard de Perfis Públicos

**Descrição:** web app para visualizar informações públicas de perfis Roblox em um painel bonito.

**Stack sugerida:** React, Node.js, Roblox APIs

**Dificuldade:** Média

**Recursos principais:**
- Busca por username
- Avatar e user ID
- Cards de informações públicas
- Histórico local
- Favoritos

**Roadmap:**
1. Criar UI de busca
2. Integrar API pública
3. Criar cards
4. Adicionar favoritos
5. Melhorar responsividade

**Cuidados:** deixar claro que o app só usa dados públicos.

---

## 18. Monitor de Status de Experiências

**Descrição:** ferramenta para acompanhar dados públicos de experiências Roblox, como visitas, favoritos e status básico.

**Stack sugerida:** Node.js, React, APIs públicas disponíveis

**Dificuldade:** Média/Alta

**Recursos principais:**
- Buscar experiência por ID
- Mostrar dados públicos
- Histórico de mudanças
- Alertas manuais
- Dashboard simples

**Roadmap:**
1. Criar busca por universe/place ID
2. Consultar dados públicos
3. Mostrar cards de status
4. Registrar histórico
5. Criar alertas simples

**Cuidados:** respeitar limites das APIs e não fazer scraping agressivo.
