import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import {
    Meteor
}
from 'meteor/meteor';
import templateUrl from './emojiCard.html';
import {
    Emojies
}
from '../../../api/emojies/index.js';
import {
    UserVotes
}
from '../../../api/uservotes/index.js';
import {
    Analytics
}
from '../../../api/analytics/index.js';
import {
    EmojieImages
}
from '../../../api/emojiesImage/index.js';
import rasterizeHTML from 'rasterizehtml';

class EmojiCardCtrl {
    constructor($reactive, $scope, $state,$http) {
        'ngInject';
        $reactive(this).attach($scope);
        this.$state = $state;
        this.$http = $http;
        emojione.ascii = true;
        var em = this.emojiDetails;
        var anlytcs_data = {
            type: 'result',
            related: this.related,
            emojiId: em._id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);

        em.isMobile = this.detectmob();
        em.mobileEmoji = emojione.shortnameToUnicode(em.emojiCode?em.emojiCode:"");
        em.emojiCode = emojione.toImage(em.emojiCode?em.emojiCode:"");
        em.emojiDesc = emojione.toImage(em.emojiDesc?em.emojiDesc:"");
        em.emojiUse = emojione.toImage(em.emojiUse?em.emojiUse:"");
        this.emoji = em;

        this.subscribe('uservotes');
        this.subscribe('emojiById', () => {
            return [this.getReactively('emojiDetails._id')];
        });
        this.subscribe('userById', () => {
            return [this.getReactively('emojiDetails.createdById')];
        })

        this.helpers({
            userId() {
                return Meteor.userId();
            },
            userById() {
                return Meteor.users.find({
                    _id: em.createdById
                });
            },
            uservotes() {
                return UserVotes.find({});
            },
            emojiById() {
                var t = Emojies.find({
                    _id: em._id
                });
                return t;
            }
        })
    }
    detectmob() {
        if (navigator.userAgent.match(/Android/i)){
            this.platform = "Android";
        }
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)){
            this.platform = "iOS";
        }

        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)  || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }
    isLoggedIn() {
        return !!Meteor.userId();
    }
    removeEmoji(id) {
        var conf = confirm("Are you sure you want to delete this emoji?");
        if (!conf) {
            return;
        }
        Emojies.remove({
            _id: id
        });
    }
    goToEmoji(id) {
        // window.location = '/#/emoji/' + id;
        this.$state.go("emoji", {
            id: id
        });
    }
    goToUserEmoji(id) {
        this.$state.go("useremoji", {
            id: id
        });
    }
    goToTag(tag) {
        this.$state.go("tag", {
            tag: tag
        });
    }
    goToBuy(id) {
        var anlytcs_data = {
            type: 'buy',
            emojiId: id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);

        //Fetch Emoji from db
        var e = Emojies.findOne({
            _id: id
        });

        var canvas;
        var context;

        canvas = document.getElementById('emojiCanvas_' + id);
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = '175px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(e.emojiCode, canvas.width / 2, canvas.height / 2);
        var dataURL = canvas.toDataURL();

        //var imageID = EmojieImages.insert({image: dataURL});
        Meteor.call('storeImage', {image: dataURL}, function(error, imageID) {
            var url = "http://www.zazzle.com/api/create/at-238415339136073373?rf=238415339136073373&ax=DesignBlast&sr=250669699809772584&cg=196751746949610314&t__useQpc=false&ed=true&t__smart=false&continueUrl=http%3A%2F%2Fwww.zazzle.com%2Furban_emojinary&rut=Go%20back%20to%20Urban%20Emojinary's%20store&fwd=ProductPage&tc=&ic=&t_definition_txt=" + encodeURIComponent(e.emojiDesc) + "&t_emoji_iid=http%3A%2F%2Furbanemojinary.com%2FemojiImage%2F" + imageID;
  
            console.log("URL: http://localhost:3000/emojiImage/"+imageID);

            var open = window.open(url, '_blank');
            if (open == null || typeof(open)=='undefined')
                alert("Turn off your pop-up blocker in Settings / Safari / Block Pop-ups");

        });
    }
    goToBuyGeneric(id) {
        var anlytcs_data = {
            type: 'buy',
            emojiId: id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);

        //Fetch Emoji from db
        var e = Emojies.findOne({
            _id: id
        });

        var canvas = document.getElementById("emojiCanvas_"+ id);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        var html = emojione.toImage(e.emojiCode);
        var newHTML = '<style>.responsive-container {height: 400px;width: 800px;position: relative;} .dummy {padding-top: 100%;} .img-container {position: absolute;top: 0;bottom: 0;left: 0;right: 0;text-align:center;font: 0/0 a;} .img-container .centerer {display: inline-block;vertical-align: middle;height: 100%;} .img-container img {vertical-align: middle;display: inline-block;}</style><div class="responsive-container"><div class="dummy"></div><div class="img-container"><div class="centerer"></div>';
        var nodes = $.parseHTML(html);
        $.each( nodes, function( i, el ) {
            var text = "";

            if (jQuery(el).prop('outerHTML')==null) {
                // text
                text = '<pre style="font-size:35px;text-align:center;vertical-align:middle;display:inline-block;">'+jQuery(el).text()+'</pre>';
            } else {
                // image
                text = jQuery(el).prop('outerHTML');
            }

            newHTML = newHTML + text;
        });

        newHTML = newHTML + "</div></div>"
        //console.log("** OLD HTML:"+html);
        //console.log("** NEW HTML:"+newHTML);

        rasterizeHTML.drawHTML(newHTML, canvas).then(function (result) {
            var dataURL = canvas.toDataURL();

            //var imageID = EmojieImages.insert({image: dataURL});
            Meteor.call('storeImage', {image: dataURL}, function(error, imageID) {
                var url = "http://www.zazzle.com/api/create/at-238415339136073373?rf=238415339136073373&ax=DesignBlast&sr=250669699809772584&cg=196751746949610314&t__useQpc=false&ed=true&t__smart=false&continueUrl=http%3A%2F%2Fwww.zazzle.com%2Furban_emojinary&rut=Go%20back%20to%20Urban%20Emojinary's%20store&fwd=ProductPage&tc=&ic=&t_definition_txt=" + encodeURIComponent(e.emojiDesc) + "&t_emoji_iid=http%3A%2F%2Furbanemojinary.com%2FemojiImage%2F" + imageID;
      
                console.log("URL: http://localhost:3000/emojiImage/"+imageID);

                var open = window.open(url, '_blank');
                if (open == null || typeof(open)=='undefined')
                    alert("Turn off your pop-up blocker in Settings / Safari / Block Pop-ups");

            });
        }, function (e) {
            console.log('An error occured:', e);
        });
    }

    goToBuyPlatformVersion(id){
        var anlytcs_data = {
            type: 'buy',
            emojiId: id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);

        //Fetch Emoji from db
        var e = Emojies.findOne({
            _id: id
        });

        var canvas;
        var context;

        canvas = document.getElementById('emojiCanvas_' + id);
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);


    }

    isEmojiUpVoted(id) {
        var arr = this.uservotes.filter(function(v) {
            if (v.emojiId === id) {
                return true;
            }
            return false;
        });
        if (arr.length > 0) {
            if (arr[0].vote > 0)
                return true;
        }
        return false;
    }
    isEmojiDownVoted(id) {
        var arr = this.uservotes.filter(function(v) {
            if (v.emojiId === id) {
                return true;
            }
            return false;
        });
        if (arr.length > 0) {
            if (arr[0].vote === -1)
                return true;
        }
        return false;
    }
    noOfUpvote(id) {
        if (this.emojiById && this.emojiById.length <= 0) {
            return;
        }
        var emoji = Emojies.find({
            _id: id
        }).fetch()[0];
        // console.log("upvotes.............id,",id,Emojies.find({_id:id}).fetch());
        var votes = emoji.votes;
        var upvotes = votes.filter(function(v) {
            if (v.vote === 1) {
                return true;
            }
            return false;
        });
        return upvotes.length;
    }
    noOfDownvote(id) {
        if (this.emojiById && this.emojiById.length <= 0) {
            return;
        }
        var emoji = Emojies.find({
            _id: id
        }).fetch()[0];
        var votes = emoji.votes;
        var downvotes = votes.filter(function(v) {
            if (v.vote === -1) {
                return true;
            }
            return false;
        });
        return downvotes.length;
    }
    upvoteEmoji(id) {
        if (!this.isLoggedIn()) {
            this.authDialog();
            return;
        }
        // console.log("Upvoted emoji...",id);
        Emojies.update({
            _id: id
        }, {
            $pull: {
                "votes": {
                    userId: Meteor.userId()
                }
            }
        }, {
            multi: true
        });
        Emojies.update({
            _id: id
        }, {
            $push: {
                "votes": {
                    userId: Meteor.userId(),
                    vote: 1
                }
            }
        }, {
            multi: true
        });
        var arr = UserVotes.find({
            userId: Meteor.userId(),
            emojiId: id
        }).fetch();
        // console.log("upvote,",id,arr);
        if (arr.length <= 0) {
            UserVotes.insert({
                userId: Meteor.userId(),
                vote: 1,
                emojiId: id
            });
        } else {
            UserVotes.update({
                _id: arr[0]._id
            }, {
                $set: {
                    userId: Meteor.userId(),
                    vote: 1,
                    emojiId: id
                }
            });
        }
    }
    downvoteEmoji(id) {
        if (!this.isLoggedIn()) {
            this.authDialog();
            return;
        }
        Emojies.update({
            _id: id
        }, {
            $pull: {
                "votes": {
                    userId: Meteor.userId()
                }
            }
        }, {
            multi: true
        });
        Emojies.update({
            _id: id
        }, {
            $push: {
                "votes": {
                    userId: Meteor.userId(),
                    vote: -1
                }
            }
        }, {
            multi: true
        });

        var arr = UserVotes.find({
            userId: Meteor.userId(),
            emojiId: id
        }).fetch();
        // console.log("downvote,",id,arr);
        if (arr.length <= 0) {
            UserVotes.insert({
                userId: Meteor.userId(),
                vote: -1,
                emojiId: id
            });
        } else {
            UserVotes.update({
                _id: arr[0]._id
            }, {
                $set: {
                    userId: Meteor.userId(),
                    vote: -1,
                    emojiId: id
                }
            });
        }
    }
    shareToFacebook(id) {
        //Insert analytics data
        var anlytcs_data = {
            type: 'share',
            related: 'facebook',
            emojiId: id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);

        var part = encodeURIComponent(window.location.origin + '?emoji=' + id + '#/emoji/' + id);
        var url = "https://www.facebook.com/sharer/sharer.php?&u=" + part;

        // var str_url = '<meta property="og:url"  content="' + part + '" />';
        // var str_type = "<meta property='og:type' content='article' />";
        // var str_title = '<meta property="og:title" content="Emoji UrbanEmojinary" />';
        // var str_name = '<meta property="og:site_name" content="UrbanEmojinary" />';
        // $('head').append(str_url + str_type + str_title + str_name);

        //Open Popup
        setTimeout(function() {
            window.open(url, "_blank", "height=600,width=600");
        }, 100);
    }
    shareToTwitter(id) {
        //Insert analytics data
        var anlytcs_data = {
            type: 'share',
            related: 'twitter',
            emojiId: id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);

        var emoji = Emojies.findOne({
            _id: id
        });

        //Open Popup
        var part = encodeURIComponent(window.location.origin + '/#/emoji/' + id);
        var url = "https://twitter.com/intent/tweet?url=" + part + "&text=" + emoji.emojiDesc;
        window.open(url, "_blank", "height=600,width=600");
    }
    shareToGoogle(id) {
        //Insert analytics data
        var anlytcs_data = {
            type: 'share',
            related: 'google',
            emojiId: id,
            dt: new Date(),
        }
        Analytics.insert(anlytcs_data);



        //Open Popup
        var part = encodeURIComponent(window.location.origin + '/#/emoji/' + id);
        var url = "https://plus.google.com/share?url=" + part;
        window.open(url, "_blank", "height=600,width=600");
    }
}
EmojiCardCtrl.$inject = ['$reactive', '$scope', '$state','$http'];

export
default angular.module('emojiCard', [
    angularMeteor,
    uiRouter,
    ngSanitize
])
    .component('emojiCard', {
        templateUrl,
        bindings: {
            emojiDetails: '=',
            shareButtons: '=',
            related: '@',
            authDialog: '&'
        },
        controller: EmojiCardCtrl,
        controllerAs: 'vm'
    });