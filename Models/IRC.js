const IRCConnection = require('./IRCConnection');
const IRCListener = require('./IRCListener');
let Collection = null;
try {
    Collection = require('betterjs').Collection;
} catch(e) {
    
}

class IRC extends IRCListener {
	constructor(options) {
		super();
		this.connections = (Collection) ? new Collection() : [];
		this.identities = options.identities;

		this.identities.forEach((identity, index) => {
			let time = identity.channels.length * 1000 * (index + 1);
			setTimeout(() => {
				let connection = new IRCConnection(identity.username, identity.password, identity.channels, (identity.lurker !== undefined) ? identity.lurker : true);
				if(Collection) {
					this.connections.add(connection);
				} else {
					this.connections.push(connection);
				}
				console.log('['+identity.username+'] Connecting...');
				
				if(index === this.identities.length - 1) {
					setTimeout(() => {
						this.emit('loaded', this.connections)
					}, identity.channels.length * 1000 + 500);
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