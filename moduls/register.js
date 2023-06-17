const { Router } = require('@grammyjs/router')
const { Keyboard } = require('grammy')
const Io = require('../Io')
const Data = new Io('./database/users.json')
const Model = require('../model/User')
const router = new Router((ctx) => ctx.session.steps)


const one = router.route('one')


let a = {id:0,name:"",surname:""}

one.command('start',async(ctx)=>{
const data = await Data.read()
let register = true;
for (let i = 0; i < data.length; i++) {
    if (data[i].id == ctx.from.id) {
     await ctx.reply('siz register botda foydanuvchilar safidasiz',{
        reply_markup:new Keyboard().text("home").resized()
     })
     ctx.session.steps = 'home'
     register = false
    }  
}
if (register) {
    await ctx.reply('salom siz register botdasiz',
{
    reply_markup:new Keyboard().text('register').resized()
})
}
})

one.hears("register",async(ctx)=>{
a.id = ctx.from.id
await ctx.reply('ismingiz?')   
ctx.session.steps = 'two'
})

const two = router.route('two')
two.on(':text',async(ctx) => {
    a.name = ctx.message.text 
    await ctx.reply('familiya?')
    ctx.session.steps = "three"
})


const three = router.route('three')
three.on(':text',async(ctx) =>{
    const data = await Data.read()
    a.surname = ctx.message.text
    await ctx.replyWithPhoto(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKeRPJ6Cu_cdiLiDb_ffrn6r0oi09bJXoGyA&usqp=CAU",
        {
            caption:"<b>xush kelibsiz</b>",
            parse_mode:"HTML"
        }
    )
    ctx.session.steps = "home"
    const newUser = new Model(
        a.id,
        a.name,
        a.surname
    )
    await Data.write(data.length ? newUser : [newUser])
})

const home = router.route('home')
home.on(':text',async(ctx) => {
    await ctx.replyWithPhoto(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKeRPJ6Cu_cdiLiDb_ffrn6r0oi09bJXoGyA&usqp=CAU",
        {
            caption:"<b>xush kelibsiz</b>",
            parse_mode:"HTML"
        }
    )
    ctx.session.steps = ''
})

module.exports = router