// Require the necessary discord.js classes
const schedule = require("node-schedule");
const { Client, Intents } = require("discord.js");
const config = require("./config/config");
const getSteamModData = require("./steammoddata/getsteammoddata");
const modEmbed = require("./botfunctions/modEmbed");
const clearChannelByID = require("./botfunctions/clearchannelbyID");
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
let ready = false;
// When the client is ready, run this code (only once)
client.once("ready", () => {
  ready = true;
  console.log("Discord Bot is Logged in and Ready!");
});
// Login to Discord with your client's token
client.login(config.Discord.token);

//Check each mod from Collection every minute
schedule.scheduleJob(config.SteamModInfo.modCheckCron, () => {
  if (ready) {
    getSteamModData
      .then((results) => {
        let modsList = results;
        if (modsList.length > 0) {
          clearChannelByID(client, 99);
          modsList.sort(
            (a, b) => parseFloat(b.lastUpdated) - parseFloat(a.lastUpdated)
          );
          for (let i = 0; i < modsList.length; i++) {
            modEmbed(client, modsList[i]);
          }
          console.log(
            `Cleared Previous list of Mods and added Mod Info for ${modsList.length} Mods`
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
