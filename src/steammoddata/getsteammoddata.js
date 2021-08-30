const { config } = require("../config/config");
const axios = require("axios");
const FormData = require("form-data");
const appendSteamAPIKey = (formData) => {
  if (config.SteamModInfo.steamAPIKey !== "") {
    formData.append("key", config.SteamModInfo.steamAPIKey);
  }
};
const getSteamModData = new Promise((resolve, reject) => {
  let collectionForm = new FormData();
  appendSteamAPIKey(collectionForm);
  collectionForm.append("collectioncount", 1);
  collectionForm.append("publishedfileids[0]", "1307721761");
  axios({
    method: "POST",
    url: "https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/",
    data: collectionForm,
    headers: collectionForm.getHeaders(),
  })
    .then((result) => {
      if (result.status === 200) {
        let modList = [];
        result.data.response.collectiondetails[0].children.forEach((mod) => {
          modList.push(mod.publishedfileid);
        });
        let modListForm = new FormData();
        appendSteamAPIKey(modListForm);
        modListForm.append("itemcount", modList.length);
        for (let i = 0; i < modList.length; i++) {
          modListForm.append(`publishedfileids[${i}]`, modList[i]);
        }
        axios({
          method: "POST",
          url: "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/",
          data: modListForm,
          headers: modListForm.getHeaders(),
        })
          .then((result) => {
            if (result.status === 200) {
              let modsData = [];
              result.data.response.publishedfiledetails.forEach((mod) => {
                let authorForm = new FormData();
                appendSteamAPIKey(authorForm);
                authorForm.append("steamids", mod.creator);
                axios({
                  method: "GET",
                  url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${config.SteamModInfo.steamAPIKey}&steamids=${mod.creator}`,
                  data: authorForm,
                  headers: authorForm.getHeaders(),
                }).then((author) => {
                  let authorDetails = author.data.response.players[0];
                  modsData.push({
                    name: mod.title,
                    modID: mod.publishedfileid,
                    modURL: `https://www.steamcommunity.com/sharedfiles/filedetails/?id=${mod.publishedfileid}`,
                    imageURL: mod.preview_url,
                    patchNotesURL: `https://www.steamcommunity.com/sharedfiles/filedetails/changelog/${mod.publishedfileid}`,
                    lastUpdated: mod.time_updated,
                    lastUpdatedFormatted: new Date(
                      mod.time_updated * 1000
                    ).toLocaleString(
                      config.DateTime.locale,
                      config.DateTime.options
                    ),
                    authorname: authorDetails.personaname,
                    authorimage: authorDetails.avatarmedium,
                  });
                });
              });
              resolve(modsData);
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    })
    .catch((err) => {
      reject(err);
    });
});
module.exports = getSteamModData;
