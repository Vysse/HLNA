const Discord = require("discord.js");
const config = require("../config/config");

let modEmbed = (client, mod) => {
  const newEmbed = new Discord.MessageEmbed();
  newEmbed
    .setColor("DARK_GREEN")
    .setAuthor(mod.name, mod.imageURL, mod.modURL)
    .setThumbnail(mod.imageURL)
    .addFields(
      {
        name: "Patch Notes",
        value: `[Click Here](${mod.patchNotesURL})`,
        inline: true,
      },
      {
        name: "Last Updated",
        value: mod.lastUpdatedFormatted,
        inline: true,
      }
    )
    .setFooter(`${mod.authorname} | Mod ID: ${mod.modID}`, mod.authorimage);
  if (
    config.DonateLinks !== undefined &&
    config.DonateLinks.length > 0 &&
    config.DonateLinks.some(
      (donateLinkMod) => donateLinkMod.modID === mod.modID
    )
  ) {
    newEmbed
      .setTitle("Donate Here")
      .setURL(
        config.DonateLinks.find(
          (donateLinkMod) => donateLinkMod.modID === mod.modID
        ).donateURL
      );
  }
  const foundChannel = client.channels.cache.find((channel) => {
    return channel.id == config.SteamModInfo.discordChannelID;
  });
  try {
    foundChannel.send({ embeds: [newEmbed] });
  } catch (error) {
    console.log(error);
  }
};
module.exports = modEmbed;
