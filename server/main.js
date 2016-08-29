import {
    Meteor
}
from 'meteor/meteor';
import {
    Emojies
}
from '../imports/api/emojies/index.js';
import {
    UserVotes
}
from '../imports/api/uservotes/index.js';
import {
    Analytics
}
from '../imports/api/analytics/index.js';
import './service-config.js';
import {
    Accounts
}
from 'meteor/accounts-base';
import {
    EmojieImages
}
from '../imports/api/emojiesImage/index.js';
var b64 = require('node-base64-image');
var ConnectHandler = __meteor_bootstrap__.app || WebApp.connectHandlers;

Accounts.emailTemplates.from = "UrbanEmojinary <accounts@urbanEmojinary.com>";

ConnectHandler.use(function(req, res, next) {
    var userAgent = req.headers['user-agent']
    if (userAgent.indexOf("facebookexternalhit") > -1) {
    	//If facebook bot visit our url
        var data = req;
        var desc, use;
        if (req.query && req.query.emoji) {
            var id = req.query.emoji;
            var emoji = Emojies.findOne({
                _id: id
            });
            desc = emoji.emojiDesc;
            use = emoji.emojiUse;
        }

        var str_type = "<meta property='og:type' content='article' />";
        var str_title = '<meta property="og:title" content="' + desc + ' - UrbanEmojinary"/>';
        var str_desc = '<meta property="og:description" content="' + use + '"/>';

        var head = str_type + str_title + str_desc;
        if (head) {
            res.write('<head>');
            res.write(head);
            res.write('</head>');
        }
        res.end();
    } else {
        next();
    }
});
Meteor.startup(() => {

	//Setup mail configuration
    if (Meteor.isServer) {
        process.env.MAIL_URL = "smtp://admin%40urbanemojinary.com:m0nkeyb0y@smtp.mailgun.org:587/";

        // HACK - 2a clear the pictures db
        var onceEveryMorning = new Cron(function() {
          EmojieImages.remove({});
        },{
          minute: 0,
          hour: 2
        });

    }

    //implement index function for collection
    var Future = Npm.require('fibers/future');
    Mongo.Collection.prototype.getIndexes = function() {
        
        var raw = this.rawCollection();
        var future = new Future();
        
        raw.indexes(function(err, indexes) {
            if (err) {
                future.return({length:0});
            } 
            else 
                future.return(indexes);
        });
        
        return future.wait();
        
    };

    //Setup index on emoji table
    if (Emojies.getIndexes().length < 2) {
        
        Emojies._ensureIndex({
            "emojiCode": "text",
            "emojiDesc": "text",
            "emojiUse": "text",
            "tags": "text"
        });
        
    }


    function toBuffer(ab) {
        var buffer = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer;
    };

    

	Meteor.methods({
        convertImage : function(url){
        	console.log(url);
        	var future = new Future();
        	var options = {string: true};
			b64.encode(url, options, function (err, image) {
			    if (err) {
	                future.throw(err);
	            }
	            var res = "data:png;base64," + image;
	            console.log(res);
	            future.return(res);
			});
	        return future.wait();
        },

        'storeImage': function(image) {
            var imageID = EmojieImages.insert(image);
            return imageID;
        },
    });

    Picker.route('/emojiImage/:id', function(params, req, res, next) {
        var image = EmojieImages.findOne({
            _id: params.id
        });
        if (image) {
            var png = toBuffer(Base64.decode(image.image.split(',')[1]));
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.write(png);
        }
        res.end("hello");
    });

});