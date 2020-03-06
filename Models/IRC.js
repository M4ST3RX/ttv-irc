const IRCConnection = require('./IRCConnection');
let Collection = null;
try {
    Collection = require('betterjs').Collection;
} catch(e) {
    
}

class IRC {
	constructor(options) {
		this.connections = (Collection) ? new Collection() : [];
		this.identities = options.identities;

		this.identities.forEach((identity, index) => {
			let time = identity.channel.length * 1000 * (index + 1);
			setTimeout(() => {
				let connection = new IRCConnection(identity.username, identity.password, identity.channels, (identity.lurker !== undefined) ? identity.lurker : true);
				if(Collection) {
					this.connections.add(connection);
				} else {
					this.connections.push(connection);
				}

			}, time + 1000);
		});
	}

	getConnections() {
		return this.connections;
	}

	getConnection() {
		if(this.connections.length === 1) {
			return this.connections[0];
		}
		return this.getConnections();
	}
}

module.exports = IRC;