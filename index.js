const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("@discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")


dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"
const CLIENT_ID = "1045535709584441365"
const GUILD_ID = "570638762195812358"