// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const films = require("./films.json");
const songs = require("./songs.json");

const commands = {};

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    //client.user.setActivity(`Serving ${client.guilds.size} Rohendor`);
    client.user.setActivity("Rohendortify "+randomSong(),{ type: 'LISTENING' });
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    //client.user.setActivity(`Serving ${client.guilds.size} Rohendor`);
    client.user.setActivity(randomSong());
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    //client.user.setActivity(`Serving ${client.guilds.size} Rohendor`);
    client.user.setActivity(randomSong());
});


client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) {
        if (message.author.username !== "Rohendor") {
            return;
        } else {
            if(Math.random() > 0.5) {
                var supportLine = ["Sì sì","Come dice lui","Bravissimo!","Verissimo","GENIO!","Eeeeh"];
                message.channel.send(pickRandom(supportLine));
            }
            return;
        }

    }

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Let's go with a few common example commands! Feel free to delete or change those.
    processCommand(command, args, message);
    
});

commands["ping"] = async function(args, message) {
    var m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

commands["say"] = async function(args, message) {
    rohendorSay(args.join(" "), message);
};

commands["pick"] = async function(args, message) {
    var m = await message.channel.send(randomPick());
};

commands["play"] = async function(args, message) {
    var m = await message.channel.send(pickRandom(["Questa canzone non mi piace","Bravissimo!","Bella canzone!","Ma ancora canzoni nel 2018?"]));
};

commands["skip"] = async function(args, message) {
    var m = await message.channel.send(pickRandom(["Noo! Mi piaceva!","Bravissimo!","Era ora!","Perché vuoi cambiare canzone?"]));
};

commands["name"] = async function(args, message) {
    var new_nick = randomNickname();
    message.channel.send(new_nick);
    var rohendor = getRohendor();
    rohendor.setNickname(new_nick).catch(function (err) { console.log(err) });
};

commands["coolname"] = async function(args, message) {
    var new_nick = randomCoolName();
    message.channel.send(new_nick);
    var rohendor = getRohendor();
    rohendor.setNickname(new_nick).catch(function (err) { console.log(err) });
};

commands["film"] = async function(args, message) {
    var i = 0;
    while (i < args[0] - 1) {
        message.channel.send(randomFilm()).catch(function (err) { console.log(err) });
        i++;
    }
    message.channel.send(randomFilm()).catch(function (err) { console.log(err) });
};

commands["song"] = async function(args, message) {
    var i = 0;
    while (i < args[0] - 1) {
        message.channel.send(randomSong()).catch(function (err) { console.log(err) });
        i++;
    }
    message.channel.send(randomSong()).catch(function (err) { console.log(err) });
};

commands["data"] = async function(args, message) {
    var pre = ["ma", "ancora"]
    var post = ["nel", (new Date()).getFullYear()+"?"];
    var args2 = pre.concat(args);
    var args2 = args2.concat(post);
    // console.log(args2);
    rohendorSay(args2.join(" "), message);
};

commands[""] = async function(args, message) {
    //new command
};

commands.default = async function(args, message) {
    var m = await message.channel.send(randomRohendorMsg()).catch(function (err) { console.log(err) });
};

async function processCommand(command, args, msg) {
    if (commands[command]) {
        commands[command](args, msg);
    } else {
        commands.default(args, msg);
    }
    
}

function randomRohendorMsg() {
    var msgs = ["Bè?", "Com'è?", "Hello!", "Come scusa?", "Bravissimo!", "Chi? Tachanka?", "A me piace il pesce!"];
    return pickRandom(msgs);
}

function randomPick() {
    var msgs = ["Montagne!", "Pulse!"];
    return pickRandom(msgs);
}

function randomNickname() {
    var pre = ["Il magnifico", "L'intramontabile", "L'imprevedibile", "Il magnificente", "L'onorevole", "L'incredibile", "Il superbo", "L'oscuro", "Il malefico", "L'innominabile"];
    pre = pickRandom(pre);
    var post = ["del deserto", "cosmico", "ubriaco", "certificato", "rivisitato", "ginnastico", "elastico", "d'altri tempi"];
    post = pickRandom(post);
    var final = pre + " Rohendor " + post;
    if (final.length > 32)
        return randomNickname();
    else
        return final;
}

function randomCoolName() {
    var film = pickRandom(films);
    var obj = decomposeTitle(film);
    obj.addRohendor();
    var name = obj.compose();
    if (name.length > 32) {
        return randomCoolName();
    } else {
        return name;
    }
}

function randomFilm() {
    try {
        var film = pickRandom(films);
        var obj = decomposeTitle(film);
        obj.addRohendor();
        var name = obj.compose();
    } catch (error) {
        console.error(error);
    }

    return name;
}

function randomSong() {
    var song = pickRandom(songs)
    var obj = decomposeTitle(song.split(" – ")[0]);
    obj.addRohendor();
    return obj.compose()+" – "+song.split(" – ")[1];
}

function pickRandom(arr) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}

function getRohendor() {
    return client.guilds.first().members.find(item => item.user.username === "Rohendor");
}

function decomposeTitle(title) {
    var obj = {};
    obj.tokens = [];
    obj.sep = [];
    var separators = [" ", "'", "-", ",","(",")"];
    var lastSep = -1;
    var i = 0;
    for (let c of title) {
        if (separators.includes(c)) {

            var token = title.slice(lastSep + 1, i);
            if (!separators.includes(token)) {
                obj.tokens.push(token);
            }
            obj.sep.push(c);
            lastSep = i;


        }
        if (i === title.length - 1) {
            obj.tokens.push(title.slice(lastSep + 1, i + 1));
        }
        i++;
    }
    obj.compose = function () {
        var title = "";
        var i = 0;
        for (t of this.tokens) {
            title += t;
            if (i < this.sep.length) {
                title += this.sep[i];
            }
            i++;
        }
        return title.replace("L'R", "Lo R").replace("l'R", "lo R").replace("r'm", "r is");
    };
    obj.addRohendor = function () {
        if (this.tokens.length === 1) {
            if (Math.random() > 0.5) {
                this.tokens.reverse()
            }
            this.tokens.push("Rohendor");
            this.sep.push(" ");
        } else {
            var pick = pickRandom(this.tokens);
            while ((pick.length / "rohendor".length) / 3 < Math.random()) {
                pick = pickRandom(this.tokens);
            }
            var index = this.tokens.indexOf(pick);
            this.tokens[index] = "Rohendor";
        }
    }
    return obj;
}

function rohendorSay(say, message) {
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    // console.log(say);
    message.delete().catch(O_o => { });
    // And we get the bot to say the thing: 
    message.channel.send(say);
}

// client.on('error', console.error);
// client.on('warn', console.warn);
// client.on('debug', console.log);

client.login(config.token);