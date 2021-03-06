const fs = require('fs');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, commands) {
		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (interaction.isSelectMenu()) {
			const tagValue = interaction.values[0];
			fs.readFile('./pocketData.json', 'utf8', async (err, jsonString) => {
				if (err) {
					console.log('Error reading file from disk:', err);
					return;
				}
				try {
					const pocketJson = JSON.parse(jsonString);
					const pocketItems = pocketJson.list;
					const filteredItemList = Object.values(pocketItems).filter((item) => {
						return item?.given_url.includes(tagValue);
					});
					const randomItem = filteredItemList[Math.floor(Math.random() * filteredItemList.length)]?.given_url;
					await interaction.reply({ content: randomItem });
				}
				catch (err) {
					console.log('Error parsing JSON string:', err);
				}
			});
		}
	},
};