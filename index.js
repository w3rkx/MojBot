require("dotenv").config();


const {
    Client,
    GatewayIntentBits,
    ActivityType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField,
    Collection
} = require("discord.js");



const client = new Client({

    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]

});



let ticketNumber = 1;
const giveaways = new Collection();



client.once("ready",()=>{

    console.log(`✅ Bot ${client.user.tag} online!`);


    client.user.setPresence({

        activities:[
            {
                name:"KLAN KIWI",
                type:ActivityType.Watching
            }
        ],

        status:"online"

    });

});




// KOMENDA PING

client.on("messageCreate", async message=>{

    if(message.author.bot) return;


    if(message.content === "!ping"){

        message.reply("🏓 Pong!");

    }



});

client.on("messageCreate", async message=>{

    if(message.author.bot) return;


    if(message.content === "!hej"){

        message.reply("Hej kociaku PetBuda z tej strony chcesz sie zapoznac zadzwon do mnie na pv💗");

    }



});

client.on("messageCreate", async message=>{

    if(message.author.bot) return;


    if(message.content === "!Burger"){

        message.reply("Wygrales MysteryBox zrob screena tej wiadomosc i wyslij na ticket");

    }



});


// PANEL TICKETÓW

client.on("messageCreate", async message=>{


    if(message.author.bot) return;


    if(message.content === "!ticket"){


        const embed = new EmbedBuilder()

        .setColor("Blue")

        .setTitle("🎫 Centrum Ticketów")

        .setDescription(
`
Witaj w systemie pomocy!

Kliknij przycisk poniżej aby otworzyć prywatny kanał.

**Zasady:**
✅ Opisz dokładnie problem
✅ Nie spamuj ticketami
✅ Poczekaj na administrację
`
        )

        .setFooter({
            text:"KLAN KIWI • Ticket System"
        });



        const button = new ButtonBuilder()

        .setCustomId("open_ticket")

        .setLabel("🎫 Otwórz Ticket")

        .setStyle(ButtonStyle.Primary);



        const row = new ActionRowBuilder()

        .addComponents(button);



        await message.channel.send({

            embeds:[embed],

            components:[row]

        });



    }



});





// PRZYCISKI

client.on("interactionCreate", async interaction=>{


    if(!interaction.isButton()) return;



    try{


        // OTWIERANIE TICKETA

        if(interaction.customId === "open_ticket"){



            // ODPOWIEDŹ OD RAZU ŻEBY NIE BYŁO TIMEOUTU

            await interaction.deferReply({
                ephemeral:true
            });





            const gunld = interaction.guild;



            const channel = await guild.channels.create({

                name:`ticket-${ticketNumber}`,

                type:ChannelType.GuildText,



                permissionOverwrites:[


                    {

                        id:guild.roles.everyone.id,

                        deny:[
                            PermissionsBitField.Flags.ViewChannel
                        ]

                    },



                    {

                        id:interaction.user.id,

                        allow:[

                            PermissionsBitField.Flags.ViewChannel,

                            PermissionsBitField.Flags.SendMessages,

                            PermissionsBitField.Flags.ReadMessageHistory

                        ]

                    },



                    {

                        id:process.env.SUPPORT_ROLE_ID,

                        allow:[

                            PermissionsBitField.Flags.ViewChannel,

                            PermissionsBitField.Flags.SendMessages,

                            PermissionsBitField.Flags.ReadMessageHistory

                        ]

                    }


                ]

            });



            ticketNumber++;





            const close = new ButtonBuilder()

            .setCustomId("close_ticket")

            .setLabel("🔒 Zamknij")

            .setStyle(ButtonStyle.Danger);




            const row = new ActionRowBuilder()

            .addComponents(close);





            const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("🎫 Ticket otwarty")

            .setDescription(
`
Witaj ${interaction.user}!

Opisz tutaj swój problem.

Administracja niedługo odpowie.
`
            );





            await channel.send({

                content:
                `${interaction.user} <@&${process.env.SUPPORT_ROLE_ID}>`,

                embeds:[embed],

                components:[row]

            });





            await interaction.editReply({

                content:
                `✅ Ticket utworzony: ${channel}`

            });



        }






        // ZAMYKANIE

if(interaction.customId === "close_ticket"){


    if(!interaction.member.roles.cache.has(process.env.1529935197267820705)) {

        return interaction.reply({

            content:"❌ Nie masz uprawnień do zamknięcia tego ticketa!",

            ephemeral:true

        });

    }


    await interaction.reply({

        content:"🔒 Ticket zostanie zamknięty za 5 sekund.",

        ephemeral:true

    });



    setTimeout(()=>{

        interaction.channel.delete().catch(()=>{});

    },5000);


}
        
    
}catch(error){


        console.error(error);



        if(interaction.deferred){


            interaction.editReply({

                content:"❌ Wystąpił błąd podczas tworzenia ticketa"

            });


        }


    }



});


// CZYSZCZENIE WIADOMOŚCI

client.on("messageCreate", async message => {

    if(message.author.bot) return;


    if(message.content.startsWith("!clearp")) {


        // sprawdzanie czy osoba podała liczbę

        const args = message.content.split(" ");

        const amount = parseInt(args[1]);



        if(!amount || isNaN(amount)) {

            return message.reply(
                "❌ Użycie: `!clearp <liczba>` np. `!clearp 10`"
            );

        }



        if(amount < 1 || amount > 100) {

            return message.reply(
                "❌ Możesz usunąć od 1 do 100 wiadomości."
            );

        }



        // sprawdzanie uprawnień

        if(!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

            return message.reply(
                "❌ Nie masz permisji do usuwania wiadomości."
            );

        }



        try {


            await message.channel.bulkDelete(amount + 1, true);



            const msg = await message.channel.send(
                `🧹 Usunięto **${amount} wiadomości**.`
            );



            setTimeout(() => {

                msg.delete().catch(()=>{});

            }, 3000);



        } catch(error) {


            console.log(error);


            message.reply(
                "❌ Nie mogę usunąć tych wiadomości."
            );


        }


    }


});

// ==========================
// SYSTEM GIVEAWAY
// ==========================



function parseTime(time) {


    const number = parseInt(time);


    if(isNaN(number)) return null;



    if(time.endsWith("s")) {

        return number * 1000;

    }


    if(time.endsWith("m")) {

        return number * 60 * 1000;

    }


    if(time.endsWith("h")) {

        return number * 60 * 60 * 1000;

    }


    if(time.endsWith("d")) {

        return number * 24 * 60 * 60 * 1000;

    }


    return null;

}




client.on("messageCreate", async message => {


    if(message.author.bot) return;



    if(message.content.startsWith("!giveawayp")) {



        if(!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {

            return message.reply(
                "❌ Nie masz permisji do tworzenia giveaway."
            );

        }



        const args = message.content.split(" ");



        const prize = args.slice(1, -1).join(" ");

        const time = args[args.length - 1];



        if(!prize || !time) {

            return message.reply(
                "❌ Poprawne użycie:\n`!giveawayp <nagroda> <czas>`\n\nPrzykład:\n`!giveawayp Nitro 24h`"
            );

        }




        const duration = parseTime(time);



        if(!duration) {

            return message.reply(
                "❌ Zły czas. Użyj np. `10m`, `2h`, `7d`."
            );

        }






        const button = new ButtonBuilder()

        .setCustomId("join_giveaway")

        .setLabel("🎉 Dołącz do Giveaway")

        .setStyle(ButtonStyle.Success);




        const row = new ActionRowBuilder()

        .addComponents(button);






        const embed = new EmbedBuilder()

        .setColor("#FFD700")

        .setTitle("🎉 GIVEAWAY 🎉")

        .setDescription(
`
## 🏆 Nagroda:
**${prize}**

⏰ Koniec za:
<t:${Math.floor((Date.now()+duration)/1000)}:R>


Kliknij przycisk aby wziąć udział!

Powodzenia wszystkim 🍀
`
        )

        .setFooter({

            text:`Organizator: ${message.author.tag}`

        })

        .setTimestamp();





        const giveawayMessage = await message.channel.send({

            embeds:[embed],

            components:[row]

        });






        giveaways.set(giveawayMessage.id, {


            prize:prize,

            users:[],

            channel:message.channel.id,

            message:giveawayMessage.id


        });






        setTimeout(async ()=>{


            const giveaway = giveaways.get(giveawayMessage.id);



            if(!giveaway) return;




            if(giveaway.users.length === 0) {


                message.channel.send(
                    `🎉 Giveaway zakończony!\n\nNagroda: **${prize}**\n❌ Brak uczestników.`
                );


                return;

            }






            const winner =
            giveaway.users[
                Math.floor(Math.random()*giveaway.users.length)
            ];






            message.channel.send(
`
🎉 **GIVEAWAY ZAKOŃCZONY!**

🏆 Nagroda:
**${prize}**

🥳 Zwycięzca:
<@${winner}>

Gratulacje!
`
            );



            giveaways.delete(giveawayMessage.id);



        }, duration);




    }


});






client.on("interactionCreate", async interaction => {


    if(!interaction.isButton()) return;



    if(interaction.customId === "join_giveaway") {



        const giveaway =
        giveaways.get(interaction.message.id);




        if(!giveaway) {


            return interaction.reply({

                content:"❌ Ten giveaway już się zakończył.",

                ephemeral:true

            });


        }





        if(giveaway.users.includes(interaction.user.id)) {


            return interaction.reply({

                content:"⚠️ Już bierzesz udział!",

                ephemeral:true

            });


        }




        giveaway.users.push(interaction.user.id);




        interaction.reply({

            content:"🎉 Dodano Cię do giveaway!",

            ephemeral:true

        });



    }



});

// ================================
// ✨ PREMIUM SYSTEM POWITAŃ / POŻEGNAŃ
// ================================


// 👋 POWITANIE

client.on("guildMemberAdd", async member => {


    const channel = member.guild.channels.cache.get(
        process.env.WELCOME_CHANNEL_ID
    );


    if(!channel) return;



    const embed = new EmbedBuilder()

    .setColor("#00ff99")

    .setAuthor({
        name: `${member.user.username} dołączył na serwer!`,
        iconURL: member.user.displayAvatarURL({ dynamic:true })
    })

    .setThumbnail(
        member.user.displayAvatarURL({ dynamic:true, size:512 })
    )

    .setTitle("🌟 Witaj w naszej społeczności!")

    .setDescription(
`
👋 Hej ${member}!

Cieszymy się, że jesteś z nami!

🎉 Jesteś naszym:
**${member.guild.memberCount} użytkownikiem**

📌 Nie zapomnij:
> przeczytać regulaminu  
> przywitać się z ekipą  
> dobrze się bawić ❤️

Powodzenia i miłej zabawy!
`
    )

    .setFooter({
        text:`${member.guild.name} • System powitań`,
        iconURL: member.guild.iconURL({dynamic:true})
    })

    .setTimestamp();



    channel.send({

        content:`🎉 Witamy ${member}!`,

        embeds:[embed]

    });


});





// 👋 POŻEGNANIE


client.on("guildMemberRemove", async member => {


    const channel = member.guild.channels.cache.get(
        process.env.GOODBYE_CHANNEL_ID
    );


    if(!channel) return;



    const embed = new EmbedBuilder()

    .setColor("#ff4444")

    .setAuthor({

        name:`${member.user.username} opuścił serwer`,

        iconURL:
        member.user.displayAvatarURL({dynamic:true})

    })

    .setThumbnail(

        member.user.displayAvatarURL({
            dynamic:true,
            size:512
        })

    )

    .setTitle("😢 Ktoś odszedł...")

    .setDescription(
`
Żegnaj ${member} 👋

Szkoda, że nas opuszczasz.

📊 Aktualna liczba osób:
**${member.guild.memberCount}**

Mamy nadzieję, że jeszcze kiedyś wrócisz ❤️
`
    )

    .setFooter({

        text:`${member.guild.name} • System pożegnań`,

        iconURL:
        member.guild.iconURL({dynamic:true})

    })

    .setTimestamp();



    channel.send({

        embeds:[embed]

    });


});

client.login(process.env.TOKEN);