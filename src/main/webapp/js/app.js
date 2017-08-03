var env = {};

// Import variables if present (from env.js)
if (window) {
	Object.assign(env, window.__env);
}

var userApp = angular.module('userApp', ['ngRoute']);

// Register environment in AngularJS as constant
userApp.constant('__env', env);

var userUrl = __env.apiUrl + __env.baseUrl;

//service to interact with Rest API
userApp.factory('userService', function($http, $q) {

	return {

		getUsers : function() {
			var defer = $q.defer();

			$http({
				method : 'GET',
				url : userUrl
			}).then(function successCallback(data, status, headers, config) {
				defer.resolve(data);
			},

			function errorCallback(data, status, headers, config) {
				defer.reject(status);
			});

			return defer.promise;
		},

		getUserInfo : function(userId) {
			var defer = $q.defer();
			var URL = userUrl + "/" + userId.id;
			console.log(URL)
			$http({
				method : 'GET',
				url : URL
			}).then(function successCallback(data, status, headers, config) {
				defer.resolve(data);
			},

			function errorCallback(data, status, headers, config) {
				defer.reject(status);
			});

			return defer.promise;
		},

		deleteUser : function(userId) {
			var defer = $q.defer();
			var URL = userUrl + "/" + userId;
			console.log(URL)
			$http({
				method : 'DELETE',
				url : URL
			}).then(function successCallback(data, status, headers, config) {
				defer.resolve(data);
			},

			function errorCallback(data, status, headers, config) {
				defer.reject(status);
			});

			return defer.promise;
		},

		saveUser : function($scope) {
			var defer = $q.defer();
			var URL = userUrl;
			console.log(URL)
			$http({
				method : 'POST',
				url : userUrl,
				headers : {
					'Content-Type' : 'application/json'
				},
				data : $scope.model,// "{\"id\":1, \"name\": \"Sukantaaa\",
			// \"email\": \"Sukanta@test.com\",
			// \"profession\": \"Project Lead\"}",
			}).then(function successCallback(data, status, headers, config) {
				defer.resolve(data);
			},

			function errorCallback(data, status, headers, config) {
				defer.reject(status);
			});

			return defer.promise;
		},

		updateUser : function($scope) {
			var defer = $q.defer();
			var URL = userUrl;
			console.log(URL)
			$http({
				method : 'PUT',
				url : userUrl,
				headers : {
					'Content-Type' : 'application/json'
				},
				data : $scope.userInfo,// "{\"id\":1, \"name\": \"Sukantaaa\",
			// \"email\": \"Sukanta@test.com\",
			// \"profession\": \"Project Lead\"}",
			}).then(function successCallback(data, status, headers, config) {
				defer.resolve(data);
			},

			function errorCallback(data, status, headers, config) {
				defer.reject(status);
			});

			return defer.promise;
		}

	};
});

// configure our routes
userApp.config(function($routeProvider,$locationProvider) {
	$routeProvider

	// route for the home page
	.when('/', {
		templateUrl : 'templates/home.html',
		controller : 'homeController'
	})
	
	// route for the add page
	.when('/add', {
		templateUrl : 'templates/createUser.html',
		controller : 'createUserController'
	})

	// route for the update page
	.when('/update', {
		templateUrl : 'templates/updateUser.html',
		controller : 'updateUserController'
	})

	// route for the view page
	.when('/view', {
		templateUrl : 'templates/allUsers.html',
		controller : 'allUserController'
	})

	// route for the view page
	.when('/viewid', {
		templateUrl : 'templates/userById.html',
		controller : 'userByIdController'
	})
	$locationProvider.hashPrefix('');

});

//create the controller and inject Angular's $scope
userApp.controller('homeController', function($scope) {
	
});

// create the controller and inject Angular's $scope
userApp.controller('createUserController', function($scope,userService) {
	// to save the user
	$scope.saveUser = function(form) {
		if (form.$valid) {
			var userPromise = userService.saveUser($scope);
			userPromise.then(
			function(response) {
				$scope.status = response.data;
				console.log("Success : saveUser" + $scope.status)
			}, function(error) {
				console.log("Failed : saveUser" + error)
			});
		} else {
			window.alert("Invalid Input");
		}
		$scope.model={};
	};
});

userApp.controller('updateUserController', function($scope,userService) {
	console.log("In updateUserController Controller");
	//Get all the User Id
	getAllUsers($scope, userService);
	
	//Populate the data based on ID
	$scope.getUserByID = function(id) {
		getUserByID($scope, userService,id)
	}
	
	$scope.updateUser = function(form) {
		if (form.$valid) {
			var userPromise = userService.updateUser($scope);
			userPromise.then(
			function(response) {
				$scope.status = response.data;
				console.log("Success : updateUser" + $scope.status)
				$scope.userInfo={};
			}, function(error) {
				console.log("Failed : updateUser" + error)
			});

		} else {
			window.alert("Invalid Input");
		}
	};
});

userApp.controller('allUserController', function($scope,userService) {

	//Get all the User Id
	getAllUsers($scope, userService);
	
	//delete User
	$scope.deleteUser = function(id) {
		var userPromise = userService.deleteUser(id);
		userPromise.then(
		function(response) {
			$scope.userInfo = response.data;
			window.alert("user Deleted..");
			getAllUsers($scope, userService);
			console.log("Success : getUserById" + $scope.users)
		}, function(error) {
			console.log("Failed : getUserById" + error)
		});
	}
});

userApp.controller('userByIdController', function($scope,userService) {
	
	//Get all the User Id
	getAllUsers($scope, userService);
	
	//Populate the data based on ID
	$scope.getUserByID = function(id) {
		getUserByID($scope, userService,id)
	}
});

// global function used in multiple controller
var getAllUsers = function($scope, userService) {
	$("#spinner").show();
	var userPromise = userService.getUsers();

	userPromise.then(

	function(response) {
		$("#spinner").hide();
		$scope.users = response.data;
		console.log("Success : getUsers" + $scope.users)
	}, function(error) {
		$("#spinner").hide();
		console.log("Failed : getUsers" + error)
	});
}

var getUserByID = function($scope, userService,id) {
	var userPromise = userService.getUserInfo(id);

	userPromise.then(

	function(response) {

		$scope.userInfo = response.data;
		console.log("Success : getUserById" + $scope.users)
	}, function(error) {
		console.log("Failed : getUserById" + error)
	});
}

