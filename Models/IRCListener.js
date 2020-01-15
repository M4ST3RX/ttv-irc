let Listener = require('events');
try {
	Listener = require('ExtraJS').Listener;
} catch(e){}

class IRCListener extends Listener {
	constructor(options){
		super();
	}
}

module.exports = IRCListener;