const { PermissionFlagsBits } = require('discord.js');
const { readImages, writeImages } = require('../utils/jsonHelper');

module.exports = {
  name: 'setimagem',
  async execute(message, client, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('Apenas administradores podem configurar imagens.');
    }

    const nome = args[1]?.toLowerCase();
    if (!nome) {
      return message.reply(`Use: \`${client.config.prefix}setimagem <nome>\` e anexe uma imagem na mesma mensagem.`);
    }

    const attachment = message.attachments.find(a => a.contentType?.startsWith('image/'));
    if (!attachment) {
      return message.reply('Anexe uma imagem na mesma mensagem.');
    }

    const url = attachment.url;
    const images = await readImages();
    images[nome] = url;
    await writeImages(images);

    await message.reply(`Imagem do comando **${nome}** configurada com sucesso.`);
  }
};
