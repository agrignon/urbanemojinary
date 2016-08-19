import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {Accounts} from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import templateUrl from './forgotpassword.html';


class ForgotPasswordCtrl{
	constructor($scope, $reactive) {
    	'ngInject';
    	$reactive(this).attach($scope);        
    }

	submit() {
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
}
ForgotPasswordCtrl.$inject = ['$scope', '$reactive'];
export default angular.module('forgotPassword',[
		angularMeteor
	])
	.component('forgotPassword',{
	    templateUrl,
        bindings : {
        },
        controller: ForgotPasswordCtrl,
        controllerAs: 'vm'
    });