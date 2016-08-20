import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './main.scss';

import emojiWeb from '../imports/ui/components/EmojiWeb/emojiWeb.component.js';

angular.module('UrbanEmojinary',[
		angularMeteor,
		emojiWeb.name
	]);

if (Meteor.isClient) {
	function onReady() {
	  angular.bootstrap(document, ['UrbanEmojinary']);
	}
	 
	if (Meteor.isCordova) {
	  angular.element(document).on('deviceready', onReady);
	} else {
	  angular.element(document).ready(onReady);
	}
}