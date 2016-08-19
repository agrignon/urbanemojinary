import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {
    Accounts
}
from 'meteor/accounts-base';
import {
    Meteor
}
from 'meteor/meteor';

import templateUrl from './login.html';


class LoginCtrl {
    constructor($scope, $reactive) {
        'ngInject';
        this.shouldShowLogin = true;
        $reactive(this).attach($scope);
    }

    submitLogin() {
        Meteor.loginWithPassword(this.form.user, this.form.password,
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
    submitRegister() {
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
    submitForgotPassword() {
        this.isSubmitting = true;
        
        Accounts.forgotPassword({email : this.form.email},
            this.$bindToContext((err) => {
                if (err) {
                    console.log(err);
                    this.formError = err.reason;
                    this.isSubmitting = false;
                    return;
                }
                this.reset();
                this.isSubmitting = false;
                this.formSuccess = "Password reset link is sent to your mail.";
            }));
    }
    reset() {
        this.form = {};
    }
    loginWithFB() {
        var self = this;
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
    resetForms(){
        this.shouldShowRegister = false;
        this.shouldShowLogin = false;
        this.shouldShowForgotPassword = false;
        this.formError = false;
    }
    showRegisterForm(){
        this.resetForms();
        this.shouldShowRegister = true;
    }
    showLoginForm(){
        this.resetForms();
        this.shouldShowLogin = true;
    }
    showForgotPasswordForm(){
        this.resetForms();
        this.shouldShowForgotPassword = true;
    }
}
LoginCtrl.$inject = ['$scope', '$reactive'];
export
default angular.module('login', [
    angularMeteor
])
    .component('login', {
        templateUrl,
        bindings: {
            onSuccess: '&',
            onForgotPassword: '&'
        },
        controller: LoginCtrl,
        controllerAs: 'vm'
    });