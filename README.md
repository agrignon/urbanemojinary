```
db.emojies.createIndex({"emojiCode":"text","emojiDesc":"text","emojiUse":"text","tags":"text"});

db.emojies.find({tags:"smile"});

db.emojies.find({$text: {$search: "smile"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});

db.emojies.find($or : [{tags:"smile"} , {$text: {$search: "smile"}}]);
```

```
db.emojies.update({emojiCode:":smile:"},{$pull:{"votes":{userId:"3"}}},{multi:true});

db.emojies.update({emojiCode:":smile:"},{$push:{"votes":{userId:"3",vote:1}}},{multi:true});

db.uservotes.update({_id:_id},{userId:'3',vote:-1,emojiId:"7"},{upsert:true});
```


```
Hello 
You can see work upto today here : https://urbanemojinary.herokuapp.com/

Features to test : 
    - Login/Signup (Facebook remaining)
    - Add Emoji 
    - Can add Category/Tags when you add new emoji
    - Search 
        - Based On emoji Code
        - Based on emoji description
        - Based on emoji use
        - Based on emoji Tags/Categories
    - Upvote/Downvote -> loggedin user only
    - User can delete his/her emoji, You will see delete button on right side on emoji card after login
    - User can see only his/her emoji by clicking "My Emojies" Button on the top
```# urbanemojinary
