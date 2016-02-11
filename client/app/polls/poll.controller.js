'use strict';

angular.module('ngvoteApp')
  .controller('PollCtrl', function ($scope, $http, socket, $stateParams, $timeout, Auth) {
    $scope.poll = {};
    $scope.pollId = $stateParams.id;
    $scope.fingerprint = "";
    $scope.alreadyVoted = false;
    $scope.userVotedFor = null;
    $scope.nowActivated = false;
    $scope.isLoading = true;
    $scope.isAdmin = Auth.isAdmin;

    //Init with Device/Client Fingerprint
    new Fingerprint2().get(function(result, components){
      $scope.fingerprint = result;

      //load Poll after fingerprint Done
      $scope.getPoll();
    });

    socket.registerUpdates("poll", function (event, poll) {
      console.log("got socket event: "+event, poll);

      //check if was not active but now active
      // then show now activated
      if ($scope.poll.active === false && poll.active === true) {
        $scope.nowActivated = true;
        $timeout(function () {
          $scope.nowActivated = false;
        }, 5000); //5s
      }

      calcTotalVotesAndCheckVotes(poll);
      $scope.poll = poll;
    });

    var calcTotalVotesAndCheckVotes = function (poll) {
      var totalVotes = 0;

      //calc totalVotes and look for fingerprint in votes
      for (var c in poll.choices) {
        var choice = poll.choices[c];
        totalVotes += choice.votes.length;

        for (var v in choice.votes) {
          var vote = choice.votes[v];
          if (vote.fingerprint === $scope.fingerprint) {
            $scope.alreadyVoted = true;
            $scope.userVotedFor = {_id: choice._id, text: choice.text};
          }
        }
      }

      //save in object
      poll.totalVotes = totalVotes;
    };

    $scope.getPoll = function () {
      $http.get('/api/polls/' + $stateParams.id).success(function(poll) {

        calcTotalVotesAndCheckVotes(poll);
        $scope.poll = poll;

        $scope.isLoading = false;
      });
    };

    $scope.vote = function () {
      var myvote = {
        pollid: $scope.poll._id,
        choiceid: $scope.poll.uservote,
        fingerprint: $scope.fingerprint
      };

      $http.post('/api/polls/' + $stateParams.id + '/vote', myvote).success(function(poll, req) {
        if (!poll) {
          console.log('err while POST vote', req);
        }
      }).error(function (err) {
        console.log('err while POST vote', err);
      });
    };

    $scope.setPollActive = function (bool) {
      var pollobj = {_id: $stateParams.id, active: bool};
      $http.put('/api/polls/' + $stateParams.id, pollobj).success(function(poll, req) {
        if (!poll) {
          console.log('err while PUT poll to setActive: '+bool, req);
        }
      }).error(function (err) {
        console.log('err while PUT poll to setActive: '+bool, err);
      });
    };

    $scope.setPollClosed = function (bool) {
      var pollobj = {_id: $stateParams.id, closed: bool};
      $http.put('/api/polls/' + $stateParams.id, pollobj).success(function(poll, req) {
        if (!poll) {
          console.log('err while PUT poll to setClosed: '+bool, req);
        }
      }).error(function (err) {
        console.log('err while PUT poll to setClosed: '+bool, err);
      });
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
