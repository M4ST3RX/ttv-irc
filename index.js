String.prototype.toCamelCase = function() {
	let parts = this.split('-');
	let output = '';
	parts.forEach((value, index) => {
		if(index === 0) {
			output += value;
		} else {
			output += value.substring(0, 1).toUpperCase() + value.slice(1);
		}
	});
	return output;
}

module.exports = {
	'IRC': require('./Models/IRC'),
	'IRCConnection': require('./Models/IRCConnection'),
	'IRCData': require('./Models/IRCData'),
	'IRCListener': require('./Models/IRCListener')
}
