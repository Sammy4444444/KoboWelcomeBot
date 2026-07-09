require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Events,
    AttachmentBuilder
} = require("discord.js");

const fs = require("fs-extra");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} Online!`);
});

client.on(Events.GuildMemberAdd, async (member) => {

    const pending = await fs.readJson("./data/pending.json");

    pending[member.id] = true;

    await fs.writeJson("./data/pending.json", pending, {
        spaces: 4
    });

    console.log(`${member.user.tag} masuk server.`);
});


client.on(Events.MessageCreate, async (message) => {

    if (message.author.bot) return;

    const pending = await fs.readJson("./data/pending.json");
    const welcomed = await fs.readJson("./data/welcomed.json");

    if (!pending[message.author.id]) return;
    if (welcomed[message.author.id]) return;

    const poster = new AttachmentBuilder("./assets/welcome.png");

    await message.reply({
        content:
`# 🎉 Welcome <@${message.author.id}>!
SELAMAT DATANG DI KAWAN KITA`,
        files: [poster]
    });

    delete pending[message.author.id];

    welcomed[message.author.id] = true;

    await fs.writeJson("./data/pending.json", pending, { spaces: 4 });
    await fs.writeJson("./data/welcomed.json", welcomed, { spaces: 4 });

    console.log(`${message.author.tag} berhasil di-welcome.`);
});

    
client.login(process.env.TOKEN);

