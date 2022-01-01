const express = require('express');
const app = express();
const port = 3000;

require('dotenv').config()
const fs = require('fs');
const path = require('path');
const download = require('download');

const Discord = require('discord.js');
const client = new Discord.Client({ intents: new Discord.Intents([Discord.Intents.FLAGS.GUILD_MEMBERS, 
                                                                    Discord.Intents.FLAGS.GUILD_MESSAGES, 
                                                                    Discord.Intents.FLAGS.GUILDS, 
                                                                    Discord.Intents.FLAGS.DIRECT_MESSAGES,
                                                                    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
                                                                    Discord.Intents.FLAGS.GUILD_INVITES,
                                                                    Discord.Intents.FLAGS.GUILD_PRESENCES,
                                                                    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
                                                                    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                                                                    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                                                                    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                                                                    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
                                                                    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
                                                                    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS]) });

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

app.get('/', (req, res) => res.send('Bot is alive!'));

client.on('ready', () =>{
    console.log(`logged in as ${client.user.tag}!`)
});

client.on('messageCreate', async (msg) => {

if(msg.guild && msg.content.startsWith('/botName')){
    if(!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
        return msg.reply('Warning: This is a Bot specific command!');
    } else{
        const name = msg.content.slice('/resetName'.length);
        msg.delete();
        client.user.setUsername(name);
        msg.author.send('Bot name changed! Warning: This can be only be done once a week!')
            }
        }

        if(msg.content.startsWith('/botAvatar')){
            if(!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
                return msg.reply('You not permitted to use this command')
            } else{
                let url = msg.content.slice('/botAvatar'.length);
                msg.delete();
                
                ( async () => {
                    await download(url, './uploads');
    
                    const imageDirPath = path.resolve(__dirname, './uploads');
                    const files = fs.readdirSync(imageDirPath);
        
                    for(const file of files) {
                        if(file === 'avatar.jpg'){
                            fs.unlinkSync(imageDirPath + '/' + file);
                        } else{
                           fs.rename(
                           imageDirPath + '/' + file,
                           imageDirPath + '/avatar.jpg', 
                           (err) => {
                               if(err){
                               console.log(err);
                               }
                           }
                           )};
                   };
                  
            
                
                })();
    
                const image = path.resolve(__dirname, './uploads');
                client.user.setAvatar(fs.readFileSync(image + '/avatar.jpg'));
                msg.author.send("Avatar Updated!");   
            };
    
        };
    
    if (msg.guild && msg.content.startsWith('/DM')) {
        if(!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return msg.reply('Warning: This is a Bot specific command!')
        } else{
        let text = msg.content.slice('/DM'.length);
        msg.guild.members.fetch().then(members =>{
            members.forEach(member =>{
            var memberCount = members.filter(member => !member.user.bot).size;  
            if (member.id != client.user.id && !member.user.bot && !member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || !member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)){
                 console.log(memberCount);
                 //sleep(10000);
                 member.send(text); 
                 sleep(7000);
            }
        });
        }
        );
        msg.delete();
    }
}
});
app.listen(port, () => console.log(`Bot listening at http://localhost:${port}`));
client.login(process.env.LOGIN_TOKEN)
