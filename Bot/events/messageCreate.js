const path = require('path');
const fs = require('fs');
const { readImages } = require('../utils/jsonHelper');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;

    const { prefix } = client.config;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args[0]?.toLowerCase();
    if (!commandName) return;

    // Comando !painel
    if (commandName === 'painel') {
      try {
        const painel = require('../commands/painel');
        await painel.execute(message, client);
      } catch (err) {
        console.error('Erro no comando painel:', err);
        await message.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true }).catch(() => {});
      }
      return;
    }

    // Comando !setimagem [nome]
    if (commandName === 'setimagem') {
      try {
        const setimagem = require('../commands/setimagem');
        await setimagem.execute(message, client, args);
      } catch (err) {
        console.error('Erro no comando setimagem:', err);
        await message.reply({ content: 'Ocorreu um erro ao configurar a imagem.', ephemeral: true }).catch(() => {});
      }
      return;
    }

    // Comandos dinâmicos de imagem: !regras, !vip, !evento, etc.
    try {
      const images = await readImages();
      if (images[commandName]) {
        await message.channel.send({
          embeds: [{
            image: { url: images[commandName] },
            color: parseInt((client.config.embedColor || '#2b2d31').replace('#', ''), 16)
          }]
        });
        return;
      }
      await message.reply(`Imagem não configurada. Use \`${prefix}setimagem ${commandName}\` com uma imagem anexada.`);
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }
  }
};
