let Collection = null;
try {
    Collection = require('betterjs').Collection;
} catch(e) {
    
}

class IRCData {
	constructor(data, type) {
		data = data.slice(1);
		let parts = data.split(';');

		parts.forEach((value) => {
			let valueParts = value.split('=');
			if(valueParts[1] !== '') {
				if(valueParts[0] === 'badges' || valueParts[0] === 'badge-info') {
					let list = valueParts[1].split(',');
					let array = (Collection) ? new Collection() : [];
					list.forEach((value) => {
						let listParts = value.split('/');
						let listObj = {};
						listObj[listParts[0]] = listParts[1];
						if(Collection) {
							array.add(listObj);
						} else {
							array.push(listObj);
						}
					});
					this[valueParts[0].toCamelCase()] = array;
				} else {
					if(/^\d+$/g.test(valueParts[1])) {
						if(valueParts[1] === '0' || valueParts[1] === '1') {
							this[valueParts[0].toCamelCase()] = !!+valueParts[1];
						} else {
							this[valueParts[0].toCamelCase()] = parseInt(valueParts[1]);
						}
					} else {
						this[valueParts[0].toCamelCase()] = valueParts[1];
					}
				}
			} else {
				this[valueParts[0].toCamelCase()] = null;
			}
		});

		if(this.systemMsg !== undefined) {
			this.systemMsg = this.systemMsg.split('\\s').join(' ');
		}

		if(type === 'PRIVMSG') {
			this.msgId = 'message';
		} else if(type === 'WHISPER') {
			this.msgId = 'whisper';
		}
	}

	add(key, value) {
		this[key] = value;
	}
}

module.exports = IRCData;