const { Bot ,session} = require('grammy');
require('dotenv').config();
const token = process.env.TOKEN
const registemodule = require('./moduls/registeModul')
const bot = new Bot(token)
const register = require('./moduls/register')

bot.use(session({
    initial:()=>({
        steps:"one"
    })
}))

bot.use(register)
bot.use(registemodule)


bot.start()