# Bot de Mines

Arquivo principal: `botplay.py`

## Ambiente

Use o arquivo `.env.example` como base para criar seu `.env` local dentro da pasta `complexos/mines`.

Variáveis esperadas pelo ambiente:

- `DISCORD_TOKEN2`
- `OWNER_ID`

## Como rodar

```bash
pip install discord.py python-dotenv
python botplay.py
```

## Observações

- O arquivo enviado foi adicionado sem alterações.
- O banco local é criado automaticamente em `db.json`.
- O painel principal é enviado pelo comando `/painel`.
- Comandos de owner dependem do `OWNER_ID` configurado.
