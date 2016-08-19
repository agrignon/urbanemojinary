import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

import templateUrl from './resetpassword.html';

class ResetPasswordCtrl{
	constructor($reactive,$scope,$stateParams,$state){
		'ngInject';
		document.title = "Reset Your UrbanEmojinary Password";
		if($stateParams.token){
			this.token = $stateParams.token;
		}else{
			$state.go('home');
		}

		this.$state = $state;
		$reactive(this).attach($scope);
	}

	isLoggedIn(){
		return !!Meteor.userId();
	}

	getUser(){
		return Meteor.user();
	}

	goBack(){
		this.$state.go('home')
	}

	submit(){
		console.log(this.form.newpass , this.token);
		var self = this;
		var token = this.token;
		var newPassword = this.form.newpass;
		Accounts.resetPassword(token, newPassword,
			this.$bindToContext((err) => {
                if (err) {
                    console.log(err);
                    this.formError = err.reason;
                    return;
                }
                self.$state.go('home');
            }));
	}
}
ResetPasswordCtrl.$inject = ['$reactive','$scope','$stateParams','$state'];
export default angular.module('resetpassword',[
		angularMeteor,
		uiRouter,
		ngSanitize,
	])
	.component('resetPassword',{
	    templateUrl,
        controller: ResetPasswordCtrl,
        controllerAs: 'vm'
    });