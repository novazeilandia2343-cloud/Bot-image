const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { ensureDataDir } = require('./utils/jsonHelper');

// Garantir que a pasta /data existe
ensureDataDir();

// Config: variáveis de ambiente (Railway) têm prioridade sobre config.json
const configFile = require('./config.json');
const config = {
  token: process.env.TOKEN || process.env.DISCORD_TOKEN || configFile.token,
  clientId: process.env.CLIENT_ID || configFile.clientId,
  guildId: process.env.GUILD_ID || configFile.guildId,
  prefix: process.env.PREFIX || configFile.prefix || '!',
  embedColor: process.env.EMBED_COLOR || configFile.embedColor || '#2b2d31',
  staffRoleName: process.env.STAFF_ROLE_NAME || configFile.staffRoleName || 'Staff'
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// Carregar eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.config = config;
client.login(config.token).catch(err => {
  console.error('Erro ao fazer login:', err.message);
});
