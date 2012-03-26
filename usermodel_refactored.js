;; This buffer is for notes you don't want to save, and for Lisp evaluation.
;; If you want to create a file, visit that file with C-x C-f,
;; then enter the text in that file's own buffer.

	    this.find({userID:dbUserID}, function(err,ids) {
		    if (err){
		    }
		else{
		    var user = nohm.factory('User');
		    user.load(ids[0], function (err, props) {
			if (err) {
			    return err;
			} else {                         
			    console.log(":::" + props);
			}
			console.log(user);
			console.log(dbUserID);
			user_obj = user;
		    });
		}
	    });




	/**
	 * This method returns the id of the logged in user
	 */
	getUserId: function (session_data) {
	    if (session_data.twitter) {
		var userID = session_data.twitter.user.id;
	    }
	    else if (session_data.facebook) {
		var userID = session_data.facebook.user.id;
	    }
	    else if (session_data.google) {
		var userID = session_data.google.user.id;
	    }
	    else {
		return null;
	    }
	    return userID;
	},

	getUserObj: function (dbUserID) {
	    var userObj = nohm.factory('User');
	    console.log("Empty User Obj:");
	    console.log(userObj);
	    var findUserCallBack = function(err,ids) {
		if (err){
		    }
		else{
		    userObj.load(ids[0], fetchUserCallBack);
		    };
	    };
		
	    var fetchUserCallBack = function (err, props) {
			if (err) {
			    return err;
			} else {                         
			    console.log("fetchUserCallBack:::");
			    for(p in props)
			    {
				console.log(p+ " ::: " + props[p]);				
			    }
			    userObj = props;
			    console.log("After fetching user obj:");
			    console.log(userObj);

			    return 
			}
		
	    };	
	    
    	    if(this.find({userID:dbUserID}, findUserCallBack)){
		console.log("before returning Obj:");
  		console.log(userObj);

		return userObj;
	    }
	},
