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
		let retry = (Collection) ? new Collection() : [];

		this.identities.forEach((identity, index) => {
			let time = (index === 0) ? 0 : 300 * (index + 1);
			setTimeout(() => {
				let connection = new IRCConnection(identity.username, identity.password, identity.channels, (identity.lurker !== undefined) ? identity.lurker : true);
				connection.on('closed', () => {
					console.log('['+identity.username+'] Failed to connect.');
					retry.push(identity);
				})
				if(Collection) {
					this.connections.add(connection);
				} else {
					this.connections.push(connection);
				}
				
				if(retry.length === 0) {
					if(index === this.identities.length - 1) {
						setTimeout(() => {
							this.emit('loaded', this.connections)
						}, time + 500);
					}
				}
			}, time);
		});

		retry.forEach((identity, index) => {
			let time = (index === 0) ? 0 : 300 * (index + 1);
			setTimeout(() => {
				let connection = new IRCConnection(identity.username, identity.password, identity.channels, (identity.lurker !== undefined) ? identity.lurker : true);
				if(Collection) {
					this.connections.add(connection);
				} else {
					this.connections.push(connection);
				}
				
				if(index === this.identities.length - 1) {
					setTimeout(() => {
						this.emit('loaded', this.connections)
					}, time + 500);
				}
			}, time);
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