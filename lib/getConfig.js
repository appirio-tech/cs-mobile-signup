var siteConfig;
/* Look for siteconfig in app home dir, if not available check if it exists in Process home. */
try {
	siteConfig = require('../siteConfig');
} catch(e) {
	try {
		siteConfig = require(process.env.HOME+'/siteConfig');
	} catch(e) {
		throw new Error('Could not load site config.')
	}
}

module.exports = siteConfig;
