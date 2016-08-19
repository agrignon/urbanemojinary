import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import home from '../../layout/home/home.component';
import emoji from '../../layout/emoji/emoji.component';
import search from '../../layout/search/search.component';
import useremoji from '../../layout/useremoji/useremoji.component';
import forgotpassword from '../../components/ForgotPassword/forgotpassword.component';
import resetpassword from '../../layout/resetpassword/resetpassword.component.js';
import tag from '../../layout/tag/tag.component.js';
import templateUrl from './emojiWeb.html'

import { Accounts } from 'meteor/accounts-base';
Accounts.onResetPasswordLink(function(token,done){
  console.log(token,done);
  window.location = '/#/reset/'+token;
})


class EmojiWebCtrl{
	constructor(){}
}

export default angular.module('emojiWeb',[
		angularMeteor,
		uiRouter,
		home.name,
		emoji.name,
		search.name,
		useremoji.name,
		forgotpassword.name,
		resetpassword.name,
		tag.name
	])
	.component('emojiWeb',{
	    templateUrl,
        controller: EmojiWebCtrl,
        controllerAs: 'vm'
    })
    .config(config);

config.$inject = ['$locationProvider', '$urlRouterProvider','$stateProvider','$locationProvider'];
function config($locationProvider, $urlRouterProvider,$stateProvider,$locationProvider) {
	'ngInject';
	$stateProvider
		.state("home",{
			url : '/',
			template : "<home></home>",
			params : {
				isMostRecent : true
			}
		})
		.state("emoji",{
			url : '/emoji/:id',
			template : "<emoji></emoji>"
		})
		.state("search",{
			url : '/search/:keyword',
			template : "<search></search>"
		})
		.state("useremoji",{
			url : '/useremoji/:id',
			template : "<useremoji></useremoji>"
		})
		.state("tag",{
			url : '/tag/:tag',
			template : "<tag></tag>"
		})
		.state("forgotpassword",{
			url : '/forgotpassword',
			template : "<forgot-password></forgot-password>"
		})
		.state("resetpassword",{
			url : '/reset/:token',
			template : "<reset-password></reset-password>"
		});
	$urlRouterProvider.otherwise('/');
	// $locationProvider.hashPrefix('!');
}
