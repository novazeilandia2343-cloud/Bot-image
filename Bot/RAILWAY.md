# Deploy no Railway

## Variáveis de ambiente

No Railway, vá em **Variables** e configure:

| Variável | Obrigatória | Exemplo | Descrição |
|----------|-------------|---------|-----------|
| `TOKEN` ou `DISCORD_TOKEN` | ✅ Sim | `seu_token_do_bot` | Token do bot no Discord |
| `CLIENT_ID` | Não | `123456789` | ID do bot (opcional) |
| `GUILD_ID` | Não | `987654321` | ID do servidor (opcional) |
| `PREFIX` | Não | `!` | Prefixo dos comandos (padrão: `!`) |
| `EMBED_COLOR` | Não | `#2b2d31` | Cor dos embeds |
| `STAFF_ROLE_NAME` | Não | `Staff` | Nome do cargo de staff dos tickets |

**Mínimo necessário:** defina `TOKEN` (ou `DISCORD_TOKEN`) com o token do seu bot.

O resto pode ficar no `config.json` ou ser sobrescrito pelas variáveis acima.

## Deploy

1. Conecte o repositório no Railway (New Project → Deploy from GitHub).
2. Adicione as variáveis em **Variables**.
3. O Railway usa `npm start` automaticamente (`node index.js`).
4. O bot sobe e mantém a conexão com o Discord.

## Dados (images.json, etc.)

Os arquivos em `/data` são gravados no sistema de arquivos do container. No Railway, **o disco é efêmero**: se o deploy rodar de novo ou o serviço reiniciar, o que foi salvo em `data/` pode ser perdido.

Para persistir:
- Use **Railway Volumes** (adicione um Volume no serviço e monte em `./data`), ou
- No futuro, migrar imagens/config para um banco ou storage externo.
