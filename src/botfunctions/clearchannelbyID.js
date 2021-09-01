const config = require("../config/config");
let clearChannelByID = (client, messagesToDelete) => {
  const foundChannel = client.channels.cache.find((channel) => {
    return channel.id == config.SteamModInfo.discordChannelID;
  });
  foundChannel.messages.fetch({ limit: messagesToDelete }).then((messages) => {
    foundChannel.bulkDelete(messages);
  });
};
module.exports = clearChannelByID;
