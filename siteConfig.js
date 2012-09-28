var settings = {
	'sessionSecret': 'cloudchallenge'
	, 'port': process.env.PORT || 3001
	, 'uri': process.env.URI
	, 'debug': (process.env.NODE_ENV !== 'production')
	, 'authKeys': {
		'github': {
			'clientID': process.env.GITHUB_OAUTH_KEY,
    		'clientSecret': process.env.GITHUB_OAUTH_SECRET,
    		'callbackURL': process.env.URI + '/auth/github/callback'
			},
		'facebook' : {
			'clientID': '181179655349684',
            'clientSecret': '63ad42218edce6965a40a5f259479fe4',
			'callbackURL': 'https://cloudspokes-communities.herokuapp.com/auth/facebook/callback'
			},
		'twitter' : {
            'consumerKey': 'Ue2FyXbGw8tnXNjxqLPOvg',
            'consumerSecret': 'yiTo6THKE8izYW70TfTqMPutkcvO0WCjuSrnAMLTaNA',
            'callbackURL': 'https://cloudspokes-communities.herokuapp.com/auth/twitter/callback'
			},
		'google': {
            'clientID': '54881129949.apps.googleusercontent.com',
            'clientSecret': 'XLwH_ATpti0_IDSeKcw9QFNs',
            'callbackURL': "https://cloudspokes-communities.herokuapp.com/auth/google/callback"
			},
		'force': {
            'clientID':'3MVG9rFJvQRVOvk6eC2MpgIU9CLA1gwqKqWX0oCc78AhxkwRTzI4XhYAwdOMbipA.n3rVJgmyDuEae9emEoXO',
            'clientSecret': '4508332996890305715',
            'callbackURL': 'https://cloudspokes-communities.herokuapp.com/auth/force/callback'
			}
	   }
    , 'services':
        [
            {
                name: 'Github',
                url:'/auth/github',
                image:'github.png'
            },
            {
                name: 'Twitter',
                url:'/auth/twitter',
                image:'twitter.png'
            },            
            {
                name: 'Facebook',
                url:'/auth/facebook',
                image:'facebook.png'
            },
            {
                name: 'Google',
                url:'/auth/google',
                image:'google.png'
            },
            {
                name: 'Salesforce',
                url:'/auth/force',
                image:'salesforce.png'
            }
        ]
};

module.exports = settings;

