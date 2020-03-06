const IRCListener = require('./IRCListener');
const IRCData = require('./IRCData');
let betterjs = null;
try {
	betterjs = require('betterjs');
} catch(e) {

}

class IRCConnection extends IRCListener {
	constructor(username, password, channels, lurker) {
		super();
		this.socket = require("ws");
		this.username = username;
		this.password = password;
		this.channels = channels;
		this.lurker = lurker;

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
		console.log("WebSocket closed - " + this.username);
	}

	parseMessage(message) {
		let messageParts = message.split(' ');

		//console.log(message);

		if(messageParts[0] === '') return null;

		if(messageParts[0].includes('tmi.twitch.tv')) {
			let code = messageParts[1];

			switch(code) {
				case '372': {
					console.log('['+this.username+'] Connected');
					let time = 0;
					this.channels.forEach((channel) => {
						setTimeout(() => {
							if(channel.startsWith('#')) {
								channel = channel.slice(1);
							}
							console.log('['+this.username+'] Joined to #'+channel);
							this.webSocket.send('JOIN #' + channel);
						}, time);
						time += 1000;
					});
					return 'JOIN';
				}
				case '421':
					// Unknown command
					return 'Unknown command';
				case 'JOIN':
					if(betterjs) {
						this.callEvent('join', messageParts[2], messageParts[0].split('@')[0].split('!')[1]);
					} else {
						this.emit('join', messageParts[2], messageParts[0].split('@')[0].split('!')[1]);
					}
					break;
				case 'PART':
					if(betterjs) {
						this.callEvent('leave', messageParts[2], messageParts[0].split('@')[0].split('!')[1]);
					} else {
						this.emit('leave', messageParts[2], messageParts[0].split('@')[0].split('!')[1]);
					}
					break;
			}
		} else if(messageParts[1].includes('tmi.twitch.tv')) {
			let msg = messageParts.slice(4,messageParts.length).join(' ').slice(1);
			let data = new IRCData(messageParts[0], messageParts[2], msg);
			data.add('username', messageParts[1].split('!')[0].slice(1));
			if(betterjs) {
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

		console.log('PRIVMSG #' + channel + " :" + msg);

		this.webSocket.send('PRIVMSG #' + channel + " :" + msg);
	}
}

module.exports = IRCConnection;