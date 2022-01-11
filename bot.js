require('dotenv').config()
const {Telegraf, Markup} = require('telegraf')
const API = require('covid19-api')
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Привет ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу.
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно командой /help.
`, Markup.keyboard([
      ['US', 'Russia'],
      ['Ukraine', 'Kazakhstan'],
    ])
      .resize()
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await API.getReportsByCountries(ctx.message.text);
    const formData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}`
    ctx.reply(formData)
  } catch (error) {
    ctx.reply('Ошибка, такой страны не существует, проверте правильность написания .');
  }
});
bot.launch();

console.log('Бот запущен');