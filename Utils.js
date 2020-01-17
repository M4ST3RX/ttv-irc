class Utils {
	static getSubPoint(planName) {
        switch(planName) {
            case '2000':
                return 2;
            case '3000':
                return 5;
            default:
                return 1;
        }
    }
    
    static getPrice(planName) {
        switch(planName) {
            case '1000':
                return '$4.99';
            case '2000':
                return '$9.99';
            case '3000':
                return '$24.99';
            default:
                return 'Twitch Prime';
        }
    }

    static getTier(planName) {
        switch(planName) {
            case '1000':
                return 'Tier 1';
            case '2000':
                return 'Tier 2';
            case '3000':
                return 'Tier 3';
            default:
                return 'Tier 1 (Prime)';
        }
    }
}

module.exports = Utils;