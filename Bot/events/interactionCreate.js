const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    const { guildId, staffRoleName, embedColor } = client.config;

    // Menu do painel de tickets (Suporte, Recrutamento, Denúncia)
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
      try {
        const value = interaction.values[0];
        const categoryName = { suporte: 'Suporte', recrutamento: 'Recrutamento', denuncia: 'Denúncia' }[value] || value;
        const staffRole = interaction.guild.roles.cache.find(r => r.name === staffRoleName);
        const channelName = `ticket-${interaction.user.username}-${Date.now().toString(36)}`;

        const channel = await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: null,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
            ...(staffRole ? [{ id: staffRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }] : [])
          ]
        });

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('ticket_fechar')
              .setLabel('Fechar')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('ticket_deletar')
              .setLabel('Deletar')
              .setStyle(ButtonStyle.Danger)
          );

        await channel.send({
          content: `${interaction.user} | **${categoryName}**`,
          embeds: [{
            description: `Ticket aberto por ${interaction.user.tag}\n\nDescreva sua solicitação.`,
            color: parseInt(embedColor.replace('#', ''), 16)
          }],
          components: [row]
        });

        await interaction.reply({
          content: `Ticket criado: ${channel}`,
          ephemeral: true
        });
      } catch (err) {
        console.error('Erro ao criar ticket:', err);
        await interaction.reply({ content: 'Erro ao criar o ticket.', ephemeral: true }).catch(() => {});
      }
      return;
    }

    // Botão Fechar ticket
    if (interaction.isButton() && interaction.customId === 'ticket_fechar') {
      try {
        const hasStaff = interaction.member.roles.cache.some(r => r.name === staffRoleName);
        const isOwner = interaction.channel.permissionOverwrites.cache.get(interaction.user.id)?.allow?.has(PermissionFlagsBits.ViewChannel);
        if (!hasStaff && !isOwner) {
          return interaction.reply({ content: 'Apenas a Staff ou o dono do ticket pode fechar.', ephemeral: true });
        }
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: null });
        await interaction.reply({ content: 'Ticket fechado. Use **Deletar** para remover o canal.' });
      } catch (err) {
        console.error('Erro ao fechar ticket:', err);
        await interaction.reply({ content: 'Erro ao fechar.', ephemeral: true }).catch(() => {});
      }
      return;
    }

    // Botão Deletar ticket
    if (interaction.isButton() && interaction.customId === 'ticket_deletar') {
      try {
        const hasStaff = interaction.member.roles.cache.some(r => r.name === staffRoleName);
        const isOwner = interaction.channel.permissionOverwrites.cache.get(interaction.user.id)?.allow?.has(PermissionFlagsBits.ViewChannel);
        if (!hasStaff && !isOwner) {
          return interaction.reply({ content: 'Apenas a Staff ou o dono do ticket pode deletar.', ephemeral: true });
        }
        await interaction.reply({ content: 'Deletando canal em 3 segundos...' });
        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
      } catch (err) {
        console.error('Erro ao deletar ticket:', err);
        await interaction.reply({ content: 'Erro ao deletar.', ephemeral: true }).catch(() => {});
      }
    }
  }
};
