const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("load songs from youtube")
        .addSubcommand((subcommand) => 
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option,setName("url").setDescription("the song's url").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("search")
                .setDescription("Searches for songs based on the provided keywords")
                .addStringOption((option) => option.setName("searchterms").setDescription("the search keywords").setRequired(true))
        ),
        run: async({client, interaction}) => {
            if(!interaction.member.voice.channel)
                return interaction.editReply("Join a voice channel to use this command")

            const queue = await client.player.createQueue(interaction.guild)
            if(!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed  = new MessageEmbed()

            if(interaction.option.getSubCommand() === "song"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if(result.tracks.length === 0)
                    return interaction.editReply("No Results")
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription('**[${song.title}]($song.url)** has been added to the queue')
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: 'Duration: ${song.duration}'})
            } else if(interaction.option.getSubCommand() === "playlist"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if(result.tracks.length === 0)
                    return interaction.editReply("No Results")
                const playlist = result.playlist
                await queue.addTrack(result.tracks)
                embed
                    .setDescription('**${result.tracks.length } songs from [${playlist.title}]($playlist.url)** have been added to the queue')
                    .setThumbnail(song.thumbnail)
            } else if (interaction.option.getSubCommand() === "search"){
                let url = interaction.options.getString("searchterms")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if(result.tracks.length === 0)
                    return interaction.editReply("No Results")
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription('**[${song.title}]($song.url)** has been added to the queue')
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: 'Duration: ${song.duration}'})
            }
        if(!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    },
}