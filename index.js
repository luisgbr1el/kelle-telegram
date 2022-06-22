/*
MIT License
Copyright (c) 2022 Luis Gabriel Araújo

*/

const express = require("express"); // App
const { NewTwitchAPI, V5TwitchAPI } = require("twitch-getter");
var fs = require("fs"); // File Sync
var axios = require("axios"); // HTTP Request
const download = require("@phaticusthiccy/open-apis"); // Tiktok Downloader Module
const cliprxyz = require("cliprxyz"); // Twitch Downloader Module
const youtubeThumbnail = require("youtube-thumbnail-downloader-hd"); // YouTube Thumbnail Downloader Module
let {parseUrl, getDetailsConcise} = require("twitter-url");  // Twitter Video Downloader Module

// Special Functions
var deleteallcache = require("./functions/deleteallcache");
var pipetofile = require("./functions/pipetofile");

// App Configs
const app = express();
const port = 3000;
app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"));
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// Telegraf Modules
const { Markup, Scenes, session, Telegraf } = require("telegraf");
const token = process.env['token'];
const bot = new Telegraf(token);
const scene = new Scenes.BaseScene("example");
const stage = new Scenes.Stage([scene]);

bot.use(session());
bot.use(stage.middleware());

bot.command("tiktok", async (ctx) => {
  // EventEmitter <bot extends keyof Telegraf>
  if (
    ctx.message.text.includes("https://vm.tiktok.com/") ||
    ctx.message.text.includes("https://www.tiktok.com/@") ||
    ctx.message.text.includes("m.tiktok.com/v/")
  ) {
    messageText = ctx.message.text;
    const url = messageText.replace("/tiktok ", "");

    ctx.replyWithMarkdown("*🔃 Baixando vídeo...*").then(({ message_id }) => {
      download.tiktok(url).then(async (data) => {
        ctx.deleteMessage(message_id);
        await ctx.scene.enter("example");


        scene.action("video", async (ctx) => {
          // If Video In Cache, Send Quickly
          async function file_exist(file_name) {
            var data_if = false;
            if (fs.existsSync(file_name) == true) {
              data_if = true;
            } else {
              data_if = false;
            }
            return data_if;
          }
          var video_cache_name =
            data.server1.video.split(".org-")[1];
          var check_file = await file_exist(
            "./src/" + video_cache_name
          );
          if (check_file) {
            await ctx.replyWithVideo({
              source: "./src/" + video_cache_name,
            });
          } else {
            await pipetofile(
              data.server1.video,
              video_cache_name
            ).then(async () => {
              await ctx.replyWithVideo(
                {
                  source: "./src/" + video_cache_name,
                },
                {
                  caption: "✅ Vídeo baixado com sucesso!",
                }
              );
            })
            .then(({ message_id }) => {
            ctx.deleteMessage(message_id);
            });
          }

          await ctx.answerCbQuery("Baixando vídeo");
        });

        scene.action("audio", async (ctx) => {
          // Use ArrayBuffer to Define Audio (Try .alloc() & .from() )
          console.log(data);
          var mp3buffer = await axios.get(data.server1.music, {
            responseType: "arraybuffer",
          });
          try {
            await ctx.replyWithVoice({ source: Buffer.from(mp3buffer.data) });
          } catch {
            await ctx.replyWithVoice({ source: Buffer.alloc(mp3buffer.data) });
          }

          await ctx.answerCbQuery("Baixando áudio");
          await ctx.replyWithMarkdown(`*✅ Áudio baixado com sucesso!*\n\n[Clique aqui](${data.server1.music}) para baixar.`)
          .then(({ message_id }) => {
            ctx.deleteMessage(message_id);
          });
        });
      });
    });

    scene.enter(
      async (ctx) =>
        await ctx
          .replyWithMarkdown(
            "Você deseja o *vídeo* ou apenas o *áudio utilizado no vídeo*?",
            Markup.inlineKeyboard([
              Markup.button.callback("Vídeo", "video"),
              Markup.button.callback("Apenas áudio", "audio"),
            ])

            //ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
          )
          
    );
  } else {
    return ctx.replyWithMarkdown(
      "*❌ Você precisa digitar o link junto do comando.* \n\n*Exemplo:*\n`/tiktok https://vm.tiktok.com/TESTE3Kmdl`"
    );
  }

  // If Local Cache Files More Than 10, Delete All (Clear Cache)
  var cachefilescount;
  try {
    fs.readdir("./src", (e, f) => {
      cachefilescount = Number(f.length);
    });
  } catch {
    cachefilescount = 0;
  }
  if (cachefilescount > 10) {
    await deleteallcache("./src");
  }
});

bot.start((ctx) =>
  ctx.replyWithMarkdown(
    `Olá, sou Kelle. Eu posso baixar vídeos do *TikTok* e do *Twitter*, clipes da *Twitch* e thumbnails do *YouTube*. \nDigite */help* e veja informações sobre mim. 😄`
  )
);

bot.help((ctx) => {
  ctx.replyWithMarkdown(
    `*📃 Os comandos disponíveis são:*

*Utilidades*
*/tiktok* ` +
      "`<linkDoVídeo>`" +
      ` - Baixar um vídeo do *TikTok*.
*/twitter* ` +
      "`<linkDoVídeo>`" +
      ` - Baixar um vídeo do *Twitter*.
*/twitch* ` +
      "`<linkDoClipe>`" +
      ` - Baixar um clipe da *Twitch*.
*/thumbyt* ` +
      "`<linkDoVídeo>`" +
      ` - Baixar a thumbnail de um vídeo do *YouTube*.

*Nativos*
*/help* - Ver os comandos e informações sobre mim.
*/social* - Ver todas as minhas mídias sociais.

*OBS:* Se eu não responder na hora, tente novamente minutos depois.

Fui desenvolvida por @luisgbr1el e @juniodevs. 🇧🇷
Fui desenhada por [Gakkou](https://www.instagram.com/gakkou03).
  
*Versão 1.3.0*`
  );
});

bot.command("social", async (ctx) => {
  ctx.replyWithMarkdown(
    `*💁🏾‍♀️ Minhas mídias sociais:*

😺 Visite meu repositório no [GitHub](https://github.com/luisgbr1el/kelle-telegram).
🐤 Me siga no [Twitter](https://twitter.com/BotKelle)!`
  );
});

bot.command("twitch", async (ctx) => {
  if (ctx.message.text.includes("https://clips.twitch.tv/")) {
    messageText = ctx.message.text;
    const url = messageText.replace("/twitch ", "");
    
    ctx.replyWithMarkdown("*🔃 Baixando clipe...*").then(({ message_id }) => {
      cliprxyz.downloadClip(url).then(res => {
        ctx.deleteMessage(message_id);
        ctx
          .replyWithVideo(
            { url: res.clipUrl },
            { caption: `✅ Clipe baixado com sucesso!` }
          )
          .then(() => {
            ctx.deleteMessage(message_id);
            ctx.replyWithMarkdown(`*Título:* ${res.clipName}
*Criador:* [${res.creatorUsername}](${res.creatorUrl})
*Jogando:* ${res.creatorWasPlaying}
*Clipe criado dia:* ${res.clippedOn}`);
          });
      });
    });
  } else {
    return ctx.replyWithMarkdown(
      "*❌ Você precisa digitar o link junto do comando.* \n\n*Exemplo:*\n`/twitch https://clips.twitch.tv/TESTE3Kmdl`"
    );
  }
});

bot.command("thumbyt", async (ctx) => {
  if (ctx.message.text.includes("https://www.youtube.com/watch") || ctx.message.text.includes("https://youtu.be/") || ctx.message.text.includes("https://m.youtube.com/watch")) {
    messageText = ctx.message.text;
    const url = messageText.replace("/thumbyt ", "");
    
    ctx.replyWithMarkdown("*🔃 Baixando thumbnail...*").then(({ message_id }) => {
      var thumbnail = youtubeThumbnail(url).highMaxRes.url;
        ctx.deleteMessage(message_id);
        ctx.replyWithPhoto(
            { url: thumbnail },
            { caption: `✅ Thumbnail baixada na melhor resolução!` })
    });
  } else {
    return ctx.replyWithMarkdown(
      "*❌ Você precisa digitar o link do vídeo junto do comando.* \n\n*Exemplo:*\n`/thumbyt https://www.youtube.com/watch?v=TESTE2MK31`"
    );
  }
});

bot.command("twitter", async (ctx) => {
  if (ctx.message.text.includes("https://www.twitter.com/") || ctx.message.text.includes("https://mobile.twitter.com/") || ctx.message.text.includes("https://twitter.com/")) {
    messageText = ctx.message.text;
    const url = messageText.replace("/twitter ", "");
  
    ctx.replyWithMarkdown("*🔃 Baixando vídeo do Twitter...*").then(async ({ message_id }) => {
      
      let {id} = parseUrl(url);
      let details = getDetailsConcise(id)
      
      if (details.videos.aspect_ratio) {

        var tweetTitle = `${(details.title)}`;
        var lastIndex = tweetTitle.lastIndexOf(" ");

        tweetTitle = tweetTitle.substring(0, lastIndex);
  
        tweetTitle.replace(/[\W]*\S+[\W]*$/, '');
          ctx.deleteMessage(message_id);
          ctx.replyWithVideo(
            { url: details.highest_video_url },
            { caption: `✅ Vídeo baixado com sucesso!` }).then(() => {
              ctx.replyWithMarkdown("*Nome do usuário:* " + details.user_name + "\n*Texto do tweet:* " + tweetTitle + "")
            })
      } else {
        ctx.deleteMessage(message_id);
        ctx.replyWithMarkdown(`*❌ Não foi encontrado nenhum vídeo nesse tweet!*`)
      }
      

    });
  } else {
    return ctx.replyWithMarkdown(
      "*❌ Você precisa digitar o link do vídeo junto do comando.* \n\n*Exemplo:*\n`/twitter https://twitter.com/user/status/TESTE2MK31`"
    );
  }
});

bot.launch();

if (bot.launch) {
  console.log("Bot online!");
}