import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import {Meteor} from 'meteor/meteor';
import templateUrl from './tag.html';
import {Emojies} from '../../../api/emojies/index.js';

import emojiCard from '../../components/EmojiCard/emojiCard.component';

class TagCtrl{
	constructor($reactive,$scope,$stateParams,$state){
		'ngInject';
		document.title = "Tag Emoji - UrbanEmojinary";
		var tag = $stateParams.tag || "";
		$reactive(this).attach($scope);
		this.$state = $state;
		emojione.ascii = true;
		this.shareButtons = true;
		
		this.subscribe('tagEmojies', () => {
			return [tag];
		});

		this.subscribe('searchedEmojies', () => {
		    return [ this.getReactively('search') ];
		});

		this.helpers({
			tagEmojies(){
				var ems = Emojies.find({tags : {$in : [tag]}});
				return ems;
			},
			searchedEmojies(){
				var ems = Emojies.find({score:{"$exists":true}});
				return ems;
			}
		})
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

	sortedTagEmojies(){
		this.tagEmojies = this.tagEmojies.sort(function mysortfunction(a, b) {
			  var o1 = a["createdDt"].setHours(0,0,0,0);
			  var o2 = b["createdDt"].setHours(0,0,0,0);
			  var p1 = a["votes"].filter(function(v){if(v.vote == 1){return true;}}).length;
			  var p2 = b["votes"].filter(function(v){if(v.vote == 1){return true;}}).length;
			  if (o1 < o2) return 1;
			  if (o1 > o2) return -1;
			  if (p1 < p2) return 1;
			  if (p1 > p2) return -1;
			  return 0;
		});
		return this.tagEmojies;
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
TagCtrl.$inject = ['$reactive','$scope','$stateParams','$state'];
export default angular.module('tag',[
		angularMeteor,
		uiRouter,
		ngSanitize,
		emojiCard.name
	])
	.component('tag',{
	    templateUrl,
        controller: TagCtrl,
        controllerAs: 'vm'
    });