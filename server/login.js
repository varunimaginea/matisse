module.exports = {
	authenticate: function(setUserDetails) {
		var UserModel = require(__dirname + '/../models/UserModel.js');
		var everyauth = require('everyauth');
		var conf = require('./conf');

		//-------------------- EveryAuth START---------------------------------//
		var usersById = {};
		var nextUserId = 0;

		var users = {};
		var service = {};
		var serviceName = '',
			serviceCode = '',
			authKeyMethod = '',
			authSecretMethod = '',
			serviceKey = '',
			serviceSecret = '';
		
		serviceDetails = [{
			serviceCode: "twit",
			serviceName: "twitter",
			oauthKeyMethod: "consumerKey",
			oauthSecretMethod: "consumerSecret"
			}, {
			serviceCode: "fb",
			serviceName: "facebook",
			oauthKeyMethod: "appId",
			oauthSecretMethod: "appSecret",
			scope: 'email,user_status'
			}, {
			serviceCode: "google",
			serviceName: "google",
			oauthKeyMethod: "appId",
			oauthSecretMethod: "appSecret",
			scope: 'https://www.googleapis.com/auth/userinfo.profile'
			}
		];

		for (var i in serviceDetails) {
			service = serviceDetails[i];
			serviceName = service["serviceName"];
			serviceCode = service["serviceCode"];
			authKeyMethod = service["oauthKeyMethod"];
			authSecretMethod = service["oauthSecretMethod"];
			serviceKey = conf[serviceCode]["appId"];
			serviceSecret = conf[serviceCode]["appSecret"];
			if (everyauth[serviceName]['scope']) {
				everyauth[serviceName]['scope'](service["scope"]);			
			}
			everyauth[serviceName][authKeyMethod](serviceKey)
								  [authSecretMethod](serviceSecret)
								  ["findOrCreateUser"](function (sess, accessToken, accessSecret, user) {
									var userDetails = users[user.id] || (users[user.id] = addUser(serviceName, user));
									var data = {
										userID: serviceName +"- " + userDetails[serviceName].id
									};
									var newUser = new UserModel();
									newUser.store(data, function (err) {
										if (!err) console.log("saved new user to DB");
										else console.log("Could not Save user, possibly exist in DB");
									});
									setUserDetails.call(this, userDetails);
									return userDetails;
								}).redirectPath('/');								
		}

		function addUser(source, sourceUser) {
			var user;
			if (arguments.length === 1) { // password-based
				user = sourceUser = source;
				user.id = ++nextUserId;
				return usersById[nextUserId] = user;
			} else { // non-password-based
				user = usersById[++nextUserId] = {
					id: nextUserId
				};
				user[source] = sourceUser;
			}
			return user;
		}
		everyauth.debug = true;		
	}
}
//-------------------- EveryAuth END---------------------------------//