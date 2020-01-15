const IRCConnection = require('./IRCConnection');
let Collection = null;
try {
    Collection = require('ExtraJS').Collection;
} catch(e) {
    
}

class IRC {
	constructor(options) {
		this.connections = (Collection) ? new Collection() : [];
		this.identities = options.identities;

		this.identities.forEach((identity) => {
			let connection = new IRCConnection(identity.username, identity.password, identity.channels);
			if(Collection) {
				this.connections.add(connection.getConnection());
			} else {
				this.connections.push(connection.getConnection());
			}
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