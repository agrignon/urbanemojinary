import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import {Meteor} from 'meteor/meteor';
import {Emojies} from '../../../api/emojies/index.js';

import emojiCard from '../../components/EmojiCard/emojiCard.component';
import templateUrl from './emoji.html';

class EmojiCtrl{
	constructor($reactive,$scope,$stateParams,$state){
		'ngInject';
		document.title = "Emoji - UrbanEmojinary";
		var emojiId = $stateParams.id;
		this.$state = $state;




		$reactive(this).attach($scope);
		this.shareButtons = true;
		emojione.ascii = true;

		this.subscribe('searchedEmojies', () => {
		    return [ this.getReactively('search') ];
		});

		this.helpers({
			searchedEmojies(){
				var ems = Emojies.find({score:{"$exists":true}});
				return ems;
			}
		})



		Meteor.call('findEmojiByID',emojiId,
			this.$bindToContext((err,data)=>{
			console.log(err,data);
			if(err){
				return;
			}
			this.emoji = data[0];

			var str_url = '<meta property="og:url"  content="' + window.location.origin + '/' + window.location.hash + '" />';
        	var str_type = "<meta property='og:type' content='article' />";
        	var str_title = '<meta property="og:title" content="'+ this.emoji.emojiDesc + ' - UrbanEmojinary" />';
        	var str_name = '<meta property="og:site_name" content="UrbanEmojinary" />';
        	var str_desc = '<meta property="og:description" content="' +  this.emoji.emojiDesc  + '" />';
        	$('head').append(str_url + str_type + str_title + str_name+str_desc);

			// console.log(this.emoji);
		}));
	}

	isLoggedIn(){
		return !!Meteor.userId();
	}
	getUser(){
		return Meteor.user();
	}
	logout(){
		Meteor.logout(this.$bindToContext((err) => {
            if (err) {
                console.log(err);
                return;
            }
        }));
	}

	goBack(isMostRecent){
		this.$state.go('home',{isMostRecent : isMostRecent})
	}
	goToSearch(){
		this.$state.go('search',{keyword:this.search});
	}
	goToUserEmojies(){
		this.$state.go('useremoji',{id: Meteor.userId()});	
	}


	searchChanged($event){
		if($event && $event.keyCode === 13){
			//Enter Key
			//Search For Emoji
			this.goToSearch();
		}
		this.suggestedEmojies = [];
		if(this.search.length > 0){
			var ems = Emojies.find({'emojiCode': {$regex: this.search, $options: 'i'}}).fetch();
			this.suggestedEmojies = ems;
			this.suggestedEmojies = this.suggestedEmojies.map(function(v){
				v.emojiCode = emojione.toImage(v.emojiCode);
				var upvotes = v.votes.filter(function(v){if(v.vote === 1){return true;}});
				v.noOfUpvotes = upvotes.length;
				var upvoteHTML = "<span class='upvotes-gray'>" + v.noOfUpvotes + " upvote(s)</span>";
				v.emojiHTML = v.emojiCode + upvoteHTML ;
				return v;
			})	
		}
	}
	showSuggestedEmoji(id){
		var ems = Emojies.find({_id : id}).fetch();
		this.clickedSuggestedEmoji = ems[0];
		this.suggestedEmojies = [];
		this.isShowingRecentEmojies = false;
		this.search = "";
	}
	sortedSearchEmojies(){
		this.searchedEmojies = this.searchedEmojies.sort(function mysortfunction(a, b) {
			  var p1 = a["votes"].filter(function(v){if(v.vote == 1){return true;}}).length;
			  var p2 = b["votes"].filter(function(v){if(v.vote == 1){return true;}}).length;
			  if (p1 < p2) return 1;
			  if (p1 > p2) return -1;
			  return 0;
		});
		return this.searchedEmojies;
	}

	

	
	openLoginModal(){
		this.resetModal();
		this.shouldShowLogin = true;
	}
	openAddEmojiModal(){
		this.resetModal();
		this.shouldShowAddDialog = true;
	}
	resetModal(){
		this.shouldShowLogin = false;
		this.shouldShowAddDialog = false;
	}
	
	onLoginSuccess(){
		this.shouldShowLogin = false;
	}
	onSuccessAddEmoji(){
		this.shouldShowAddDialog = false;	
		this.goToUserEmojies();
	}
}
EmojiCtrl.$inject = ['$reactive','$scope','$stateParams','$state'];
export default angular.module('emoji',[
		angularMeteor,
		uiRouter,
		ngSanitize,
		emojiCard.name
	])
	.component('emoji',{
	    templateUrl,
        controller: EmojiCtrl,
        controllerAs: 'vm'
    });