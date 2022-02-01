/*
MIT License
Copyright (c) 2022 Luis Gabriel Araújo

*/

const express = require("express"); // App
var fs = require("fs"); // File Sync
var axios = require("axios"); // HTTP Request
const download = require("@phaticusthiccy/open-apis"); // Tiktok Downloader Module
const cliprxyz = require("cliprxyz"); // Twitch Downloader Module

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
const bot = new Telegraf("YOUR_BOT_TOKEN");
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

        // console.log(data)

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
            data.server2.url.split(".com/")[1].split("/")[0] +
            data.server2.video_id;
          var check_file = await file_exist(
            "./src/" + video_cache_name + ".mp4"
          );
          if (check_file) {
            await ctx.replyWithVideo({
              source: "./src/" + video_cache_name + ".mp4",
            });
          } else {
            await pipetofile(
              data.server1.video,
              video_cache_name + ".mp4"
            ).then(async () => {
              await ctx.replyWithVideo(
                {
                  source: "./src/" + video_cache_name + ".mp4",
                },
                {
                  caption: "✅ Vídeo baixado com sucesso!",
                }
              );
            });
          }

          await ctx.answerCbQuery("Vídeo");
          await ctx.replyWithMarkdown(`*Criador:* [${data.server2.user.username}](https://tiktok.com/@${data.server2.user.username}/)
*Legenda:* ${data.server2.caption}
*Visualizações:* ${data.server2.stats.views}
*Likes:* ${data.server2.stats.likes}
*Popularidade:* ${data.server2.stats.popularity}
*Data de publicação:* ${data.server2.created_at}`);
        });

        scene.action("audio", async (ctx) => {
          // Use ArrayBuffer to Define Audio (Try .alloc() & .from() )
          var mp3buffer = await axios.get(data.server1.music, {
            responseType: "arraybuffer",
          });
          try {
            await ctx.replyWithVoice({ source: Buffer.from(mp3buffer.data) });
          } catch {
            await ctx.replyWithVoice({ source: Buffer.alloc(mp3buffer.data) });
          }

          await ctx.answerCbQuery("Apenas áudio");
          await ctx.replyWithMarkdown(`*✅ Áudio baixado com sucesso!*

*Título:* ${data.server2.music.title}
*Autor:* ${data.server2.music.author}`);
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
          .then(({ message_id }) => {
            setTimeout(() => ctx.deleteMessage(message_id), 60 * 1000);
            // console.log(message_id)
          })
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
    `Olá, sou Kelle. Eu posso baixar vídeos do *TikTok*, clipes da *Twitch*, etc. \nDigite */help* e veja informações sobre mim. 😄`
  )
);

bot.help((ctx) => {
  ctx.replyWithMarkdown(
    `*📃 Os comandos disponíveis são:*
*/help* - Ver os comandos e informações sobre mim.
*/tiktok* ` +
      "`<linkDoVídeo>`" +
      ` - Baixar um vídeo do *TikTok*.
*/twitch* ` +
      "`<linkDoClipe>`" +
      ` - Baixar um clipe da *Twitch*.
*/social* - Ver todas as minhas mídias sociais.

*OBS:* Se eu não responder na hora, tente novamente minutos depois.

Fui desenvolvida por @luisgbr1el e @juniodevs. 🇧🇷
Fui desenhada por [Gakkou](https://www.instagram.com/gakkou03).
  
*Versão 1.2.0*`
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
*Clipe criado dia:*${res.clippedOn}`);
          });
      });
    });
  } else {
    return ctx.replyWithMarkdown(
      "*❌ Você precisa digitar o link junto do comando.* \n\n*Exemplo:*\n`/twitch https://clips.twitch.tv/TESTE3Kmdl`"
    );
  }
});

bot.launch();

if (bot.launch) {
  console.log("Bot online!");
}
