'use strict';

angular.module('ngvoteApp')
  .controller('PollsCtrl', function ($scope, $http, socket) {
    $scope.polls = [];

    $scope.getPolls = function () {
      $http.get('/api/polls').success(function(polls) {
        $scope.polls = polls;
        socket.syncUpdates('polls', $scope.polls);
      });
    };

    //Load on Controller Init
    $scope.getPolls();
  });
