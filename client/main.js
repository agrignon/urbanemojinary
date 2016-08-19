import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './main.scss';

import emojiWeb from '../imports/ui/components/EmojiWeb/emojiWeb.component.js';

angular.module('UrbanEmojinary',[
		angularMeteor,
		emojiWeb.name
	]);

