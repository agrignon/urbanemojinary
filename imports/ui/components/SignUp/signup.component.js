import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {Accounts} from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import templateUrl from './signup.html';



class SignUpCtrl {
    constructor($scope, $reactive) {
    	'ngInject';
    	$reactive(this).attach($scope);
        this.testMsg = "Hello Msg";
    }

    submit() {
        Accounts.createUser(this.form,
            this.$bindToContext((err) => {
                if (err) {
                    console.log(err);
                    this.formError = err.reason;
                    return;
                }
                this.reset();
                this.onSuccess();
            }));
    }
    reset() {
        this.form = {};
    }

    loginWithFB(){
        Meteor.loginWithFacebook({},
            this.$bindToContext((err) => {
                if (err) {
                    console.log(err);
                    this.formError = err.reason;
                    return;
                }
                this.onSuccess();
            }));
    }
}
SignUpCtrl.$inject = ['$scope', '$reactive'];

export
default angular.module('signup', [
    angularMeteor
])
    .component('signup', {
        templateUrl,
        bindings : {
            onSuccess : '&'
        },
        controller: SignUpCtrl,
        controllerAs: 'vm'
    });