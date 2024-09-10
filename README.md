# Radio Link - Discord Voice Bot
Radio Link is a Discord bot that joins voice channels and plays a live radio stream using @discordjs/voice and ffmpeg-static. The bot listens for specific commands in the chat and joins voice channels accordingly.

## Features
- Joins a voice channel upon command.
- Plays the live radio stream from KMHD (a jazz radio station) in the voice channel.
- Handles reconnection attempts if the stream fails.
- Graceful error handling and resource cleanup.
## Prerequisites
- Node.js (version 16.9.0 or higher)
- Discord account and a server where you can invite the bot.
- A .env file with your Discord bot token.
# Installation
- Clone this repository
- Install dependencies: `npm install`
- Create a .env file in the root directory and add your Discord bot token: `DISCORD_TOKEN=your-bot-token`
- Run the bot: `node main.js`

# Bot Commands
- `/marvbot`: The bot joins the user's current voice channel.
- `/kmhd`: The bot starts streaming KMHD radio in the voice channel.
# Structure
- main.js: The main script that contains the bot's logic for joining voice channels and playing the radio stream.
- .env: The environment file to store your Discord bot token securely.
- package.json: Lists the required dependencies (discord.js, @discordjs/voice, ffmpeg-static, etc.).
## How It Works
### Joining a Voice Channel:
When a user sends the /marvbot command in a text channel, the bot joins the user's voice channel. If the bot is already in the voice channel, it informs the user.

### Playing Radio:
Upon receiving the /kmhd command, the bot streams the KMHD radio station into the voice channel using ffmpeg to transcode the stream. If the bot is not in a voice channel, it will prompt the user to make the bot join first.

### Handling Errors:
The bot handles stream disconnections or errors, attempting to reconnect up to 10 times if the stream fails.

## Dependencies
- discord.js: A powerful library for interacting with the Discord API.
- @discordjs/voice: A module for creating audio players and handling voice channels in Discord.
- ffmpeg-static: Provides a static version of ffmpeg, which is used to handle audio streaming.
- DISCORD_TOKEN: Your Discord bot token, which you can obtain by creating a bot on the Discord Developer Portal.

# Getting Started with Discord Bots
If you haven't created a Discord bot before, follow these steps:

- Go to the Discord Developer Portal and create a new application.
- Navigate to the "Bot" section and create a bot for your application.
- Copy the token provided and place it in your .env file as shown above.
- Invite the bot to your server using the OAuth2 URL generator and make sure it has appropriate permissions to connect to voice channels.
