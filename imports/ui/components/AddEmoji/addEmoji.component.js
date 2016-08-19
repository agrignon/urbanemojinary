import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import Taggle from 'taggle';
import { Meteor } from 'meteor/meteor';
// import j from 'jquery-ui';

import templateUrl from './addEmoji.html';
import {Emojies} from '../../../api/emojies/index.js';


class AddEmojiCtrl{
	constructor($reactive,$scope){
		'ngInject';

		this.testMsg = "Hello Msg 1";
		$reactive(this).attach($scope);
		emojione.ascii = true;

		Meteor.setTimeout(() => {
			var self = this;
			var tags = ['smily','joy','smile','car','urban'];
			this.taggle_tag = new Taggle("tags",{
				duplicateTagClass: 'bounce',
				allowedTags: tags
			});
			var container = this.taggle_tag.getContainer();
			var input = this.taggle_tag.getInput();
			console.log(input);
			$(input).autocomplete({
			    source: tags,
			    appendTo: container,
			    position: { at: "left bottom", of: container },
			    select: function(event, data) {
			        event.preventDefault();
			        //Add the tag if user clicks
			        if (event.which === 1) {
			            self.taggle_tag.add(data.item.value);
			        }
			    }
			});
		});
	}

	getUser(){
		return Meteor.user();
	}

	addEmoji(){
		this.form.createdDt = new  Date();
		this.form.createdBy = this.getUser().username;
		this.form.createdById = Meteor.userId();
		this.form.votes = [];
		this.form.tags = this.taggle_tag.getTags().values;
		Emojies.insert(this.form);
		this.reset();
		this.onSuccessfullAdd();
	}

	reset(){
		this.form = {};
	}

	
}
AddEmojiCtrl.$inject = ['$reactive','$scope'];
export default angular.module('addEmoji',[
		angularMeteor,
		uiRouter,
		ngSanitize
	])
	.component('addEmoji',{
	    templateUrl,
	    bindings : {
            onSuccessfullAdd : '&'
        },
        controller: AddEmojiCtrl,
        controllerAs: 'vm'
    });
