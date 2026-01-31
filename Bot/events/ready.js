module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot conectado como ${client.user.tag}`);
    console.log(`Servidores: ${client.guilds.cache.size}`);
    client.user.setActivity('!painel | Tickets', { type: 3 }); // WATCHING
  }
};
