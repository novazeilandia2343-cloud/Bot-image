const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'painel',
  async execute(message, client) {
    const { embedColor } = client.config;
    const color = parseInt(embedColor.replace('#', ''), 16);

    const embed = new EmbedBuilder()
      .setTitle('🎫 Painel de Tickets')
      .setDescription('Selecione uma opção abaixo para abrir um ticket')
      .setFooter({ text: 'Horário de atendimento: 10:00 às 23:00' })
      .setColor(color);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_menu')
        .setPlaceholder('Selecione o tipo de ticket')
        .addOptions([
          { label: 'Suporte', value: 'suporte', description: 'Abrir ticket de suporte' },
          { label: 'Recrutamento', value: 'recrutamento', description: 'Abrir ticket de recrutamento' },
          { label: 'Denúncia', value: 'denuncia', description: 'Abrir ticket de denúncia' }
        ])
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    if (message.deletable) await message.delete().catch(() => {});
  }
};
