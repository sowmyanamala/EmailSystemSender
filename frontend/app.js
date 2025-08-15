var app = angular.module('emailApp', []);

app.controller('MainController', function($scope, $http) {
  $scope.submitForm = function() {
    $http.post('http://localhost:3000/api/users', {
      name: $scope.name,
      email: $scope.email
    }).then(function(response) {
      $scope.message = response.data.message;
      $scope.name = '';
      $scope.email = '';
    }, function(error) {
      $scope.message = "Error: " + error.data;
    });
  };
});
