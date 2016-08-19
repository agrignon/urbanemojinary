import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import {Meteor} from 'meteor/meteor';
import templateUrl from './home.html';
import {Emojies} from '../../../api/emojies/index.js';

import signup from '../../components/SignUp/signup.component';
import login from '../../components/Login/login.component';
import addEmoji from '../../components/AddEmoji/addEmoji.component';
import emojiCard from '../../components/EmojiCard/emojiCard.component';

class HomeCtrl{
	constructor($reactive,$scope,$state,$stateParams){
		'ngInject';

		if($stateParams){
			console.log($stateParams);
			var isMostRecent = $stateParams.isMostRecent;
			this.shouldShowRecent = isMostRecent;
			this.shouldShowPopular = !isMostRecent;
		}


		document.title = "Home - UrbanEmojinary";
		$reactive(this).attach($scope);
		this.$state = $state;
		emojione.ascii = true;
		this.shareButtons = true;
		this.isShowingRecentEmojies = true;
		// this.shouldShowPopular = false;
		// this.shouldShowRecent = true;

		this.subscribe('emojies');
		this.subscribe('userEmojies', () => {
			if(this.isLoggedIn()){
				return [ Meteor.userId() ];
			}
			return [];
		});
		this.subscribe('searchedEmojies', () => {
		    return [ this.getReactively('search') ];
		});

		this.helpers({
			emojies(){
				var ems = Emojies.find({},{limit : 20});
				ems.fetch();
				// console.log("Emojies:",);
				return ems; 
			},
			userEmojies(){
				// console.log(Meteor.userId());
				if(this.isLoggedIn()){
					var ems = Emojies.find({createdById : Meteor.userId()});
					// console.log("UserEmojies:",ems.fetch());
					return ems;	
				}
				return [];
			},
			searchedEmojies(){
				var ems = Emojies.find({score:{"$exists":true}});
				// console.log("SearchedEmojies:",ems.fetch());
				return ems;
			}
		})
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

	goBack(){
		this.clickedSuggestedEmoji = undefined;
		this.suggestedEmojies = [];
		this.isShowingRecentEmojies = true;
		this.search = "";
	}

	goToSearch(){
		this.$state.go('search',{keyword:this.search});
	}

	goToUserEmojies(){
		this.$state.go('useremoji',{id: Meteor.userId()});	
	}

	reset(){
		this.form = {};
	}

	isLoggedIn(){
		return !!Meteor.userId();
	}

	getUser(){
		return Meteor.user();
	}

	sortedEmojies(){
		this.emojies = this.emojies.sort(function mysortfunction(a, b) {
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
		return this.emojies;
	}
	sortedMixEmojies(){
		this.emojies = this.emojies.sort(function mysortfunction(a, b) {
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
		return this.emojies;
	}
	sortedRecentEmojies(){
		this.emojies = this.emojies.sort(function mysortfunction(a, b) {
			  var o1 = a["createdDt"].setHours(0,0,0,0);
			  var o2 = b["createdDt"].setHours(0,0,0,0);
			  if (o1 < o2) return 1;
			  if (o1 > o2) return -1;
			  return 0;
		});
		return this.emojies;
	}
	sortedPopularEmojies(){
		this.emojies = this.emojies.sort(function mysortfunction(a, b) {
			  var p1 = a["votes"].filter(function(v){if(v.vote == 1){return true;}}).length;
			  var p2 = b["votes"].filter(function(v){if(v.vote == 1){return true;}}).length;
			  if (p1 < p2) return 1;
			  if (p1 > p2) return -1;
			  return 0;
		});
		return this.emojies;
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
	sortedUserEmojies(){
		this.userEmojies = this.userEmojies.sort(function mysortfunction(a, b) {
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
		return this.userEmojies;
	}

	logout(){
		Meteor.logout(this.$bindToContext((err) => {
            if (err) {
                console.log(err);
                return;
            }
        }));
	}

	openLoginModal(){
		this.resetModal();
		this.shouldShowLogin = true;
	}
	openSignUpModal(){
		this.resetModal();
		this.shouldShowSignUp = true;
	}
	openAddEmojiModal(){
		this.resetModal();
		this.shouldShowAddDialog = true;
	}
	onForgotPasswordClicked(){
		this.resetModal();
		this.shouldShowForgotPassword = true;
	}
	toggleUserEmojies(){
		this.isShowingUserEmojies = !this.isShowingUserEmojies;
	}

	resetModal(){
		this.shouldShowLogin = false;
		this.shouldShowSignUp = false;
		this.shouldShowAddDialog = false;
		this.shouldShowForgotPassword = false;
	}

	onSignUpSuccess(){
		this.shouldShowSignUp = false;
	}
	onLoginSuccess(){
		this.shouldShowLogin = false;
	}
	onSuccessAddEmoji(){
		this.shouldShowAddDialog = false;	
	}
	
}
HomeCtrl.$inject = ['$reactive','$scope','$state','$stateParams'];
export default angular.module('home',[
		angularMeteor,
		uiRouter,
		ngSanitize,
		signup.name,
		login.name,
		addEmoji.name,
		emojiCard.name
	])
	.component('home',{
	    templateUrl,
        controller: HomeCtrl,
        controllerAs: 'vm'
    });