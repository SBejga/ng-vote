'use strict';

angular.module('ngvoteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('polls', {
        url: '/',
        templateUrl: 'app/polls/polls.html',
        controller: 'PollsCtrl'
      })
      .state('poll', {
        url: '/poll/:id',
        templateUrl: 'app/polls/poll.html',
        controller: 'PollCtrl'
      });
  });
