var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

var userApp = angular.module('userApp', []);

//Register environment in AngularJS as constant
userApp.constant('__env', env);

var userUrl = __env.apiUrl + __env.baseUrl;

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
		
		getUserInfo : function(userId){
			var defer = $q.defer();
			var URL = userUrl+"/"+userId.id;
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
		
		deleteUser : function(userId){
			var defer = $q.defer();
			var URL = userUrl+"/"+userId;
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
		
		saveUser : function($scope){
			var defer = $q.defer();
			var URL = userUrl;
			console.log(URL)
			$http({
				method : 'POST',
				url : userUrl,
				headers: {'Content-Type': 'application/json'},
			    data: $scope.model,//"{\"id\":1,  \"name\": \"Sukantaaa\",  \"email\": \"Sukanta@test.com\",  \"profession\": \"Project Lead\"}",
			}).then(function successCallback(data, status, headers, config) {
				defer.resolve(data);
			},

			function errorCallback(data, status, headers, config) {
				defer.reject(status);
			});

			return defer.promise;
		},
		
		updateUser : function($scope){
			var defer = $q.defer();
			var URL = userUrl;
			console.log(URL)
			$http({
				method : 'PUT',
				url : userUrl,
				headers: {'Content-Type': 'application/json'},
			    data: $scope.userInfo,//"{\"id\":1,  \"name\": \"Sukantaaa\",  \"email\": \"Sukanta@test.com\",  \"profession\": \"Project Lead\"}",
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

userApp.controller('userCtrl', function($scope, userService) {
	$scope.showTable = 0;
	$scope.addUser = 0;
	$scope.showSelect = 0;
	$scope.showDelete =0;
	$scope.showUpdate = 0
	
	$scope.deleteUser= function(id){
		
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
	$scope.getAllUsers = function() {
		getAllUsers($scope, userService)
		$scope.showSelect = 0;
		$scope.showTable = 1;
		$scope.addUser = 0;
		$scope.showDelete =0;
		$scope.showUpdate = 0
	};

	$scope.getUserId = function() {
		getAllUsers($scope, userService);
		$scope.showTable = 0;
		$scope.showSelect = 1;
		$scope.addUser = 0;
		$scope.showDelete =0;
		$scope.showUpdate = 0
		$scope.userInfo={};
	}
	
	$scope.getUserByID = function(id) {
		
		var userPromise = userService.getUserInfo(id);

		userPromise.then(

		function(response) {
			
			$scope.userInfo = response.data;
			console.log("Success : getUserById" + $scope.users)
		}, function(error) {
			console.log("Failed : getUserById" + error)
		});
	}
	
	$scope.addUserView = function(){
		$scope.showTable = 0;
		$scope.showSelect = 0;
		$scope.addUser = 1;
		$scope.showDelete =0;
		$scope.showUpdate = 0;
		$scope.status={};
		/*$scope.model.id="";
		$scope.model.name="";
		$scope.model.profession="";*/
	}
	
	$scope.updateUserView = function(){
		getAllUsers($scope, userService);
		$scope.showTable = 0;
		$scope.showSelect = 0;
		$scope.addUser = 0;
		$scope.showDelete =0;
		$scope.showUpdate = 1
		$scope.status={};
		$scope.userInfo.name="";
		$scope.userInfo.profession="";
		$scope.userInfo.email="";
	}
	
	$scope.saveUser = function(form){
		$scope.showTable = 0;
		$scope.showSelect = 0;
		$scope.addUser = 1;
		$scope.showDelete =0;
		$scope.showUpdate = 0
        if(form.$valid) {
        	
        	
        	var userPromise = userService.saveUser($scope);

    		userPromise.then(

    		function(response) {
    			
    			$scope.status = response.data;
    			document.getElementById('id01').style.display='block';
    			console.log("Success : saveUser" + $scope.status)
    		}, function(error) {
    			console.log("Failed : saveUser" + error)
    		});
        	
        	
        } else{
             window.alert("Invalid Input");
        }
    };
    
    $scope.updateUser = function(form){
		$scope.showTable = 0;
		$scope.showSelect = 0;
		$scope.addUser = 0;
		$scope.showDelete =0;
		$scope.showUpdate = 1
        if(form.$valid) {
        	
        	
        	var userPromise = userService.updateUser($scope);

    		userPromise.then(

    		function(response) {
    			
    			$scope.status = response.data;
    			console.log("Success : updateUser" + $scope.status)
    		}, function(error) {
    			console.log("Failed : updateUser" + error)
    		});
        	
        	
        } else{
             window.alert("Invalid Input");
        }
    };

});

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
