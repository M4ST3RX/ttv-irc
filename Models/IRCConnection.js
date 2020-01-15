const IRCListener = require('./IRCListener');
const IRCData = require('./IRCData');
let ExtraJS = null;
try {
	ExtraJS = require('ExtraJS');
} catch(e) {

}


class IRCConnection extends IRCListener {
	constructor(username, password, channels) {
		super();
		this.socket = require("ws");
		this.username = username;
		this.password = password;
		this.channels = channels;

		this.webSocket = new this.socket(`ws://irc-ws.chat.twitch.tv:80/`, "irc");
		
		this.webSocket.onmessage = this.onMessage.bind(this);
		this.webSocket.onerror = this.onError.bind(this);
		this.webSocket.onclose = this.onClose.bind(this);
		this.webSocket.onopen = this.onOpen.bind(this);
	}

	onOpen() {
		this.webSocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
		this.webSocket.send(`PASS ${this.password}`);
		this.webSocket.send(`NICK ${this.username}`);		
	}

	onMessage(event) {
		let parts = event.data.split("\r\n");

		parts.forEach(message => {
			if(message === "PING :tmi.twitch.tv") {
				//console.log(`Executing command: PONG :tmi.twitch.tv`)
				this.webSocket.send("PONG :tmi.twitch.tv")
			} else {
				let msg = this.parseMessage(message);
				//console.log(message);
				//console.log(msg);
			}
		});
	}

	onError() {
		console.log("Error: " + ((this.webSocket === null) ? "Unable to connect." : "Connection closed."));
	}

	onClose() {
		console.log("WebSocket closed.");
	}

	getConnection() {
		return this;
	}

	parseMessage(message) {
		let messageParts = message.split(' ');

		if(messageParts[0] === '') return null;

		if(messageParts[0].includes('tmi.twitch.tv')) {
			let code = messageParts[1];

			switch(code) {
				case '372':
					this.channels.forEach((channel) => {
						if(channel.startsWith('#')) {
							channel = channel.slice(1);
						}
						this.webSocket.send('JOIN #' + channel);
					});
					return 'JOIN';
				case '421':
					// Unknown command
					return 'Unknown command';
			}
		} else if(messageParts[1].includes('tmi.twitch.tv')) {
			let data = new IRCData(messageParts[0], messageParts[2]);
			let msg = messageParts.slice(4,messageParts.length).join(' ').slice(1);
			data.add('username', messageParts[1].split('!')[0].slice(1));
			if(ExtraJS) {
				this.callEvent(data.msgId, messageParts[3], msg, data);
			} else {
				this.emit(data.msgId, messageParts[3], msg, data);
			}
		}
	}

	say(channel, msg){
		if(channel.startsWith('#')) {
			channel = channel.slice(1);
		}
		this.webSocket.send('PRIVMSG #' + channel + " :" + msg);
	}
}

module.exports = IRCConnection;