# Economy-Discord-Bot
A basic economy system for Discord built with [Pylon.bot](https://pylon.bot)
## Setup
Just copy and paste the code into your [Pylon editor](https://pylon.bot/studio) and change a few things to fit your server.
 - Line 61: Replace these emojis with an emoji of your choosing! To find out the syntax for a custom emoji on your server, just type `\:emoji:`.
 - Line 154: Replace this text with the ID of an "upvote" emoji of your choosing! To figure out the ID type `\:emoji:`. The ID should come after `:emoji:` and before `>`.
 - Line 155: Replace this text with the ID of an "downvote" emoji of your choosing! To figure out the ID type `\:emoji:`. The ID should come after `:emoji:` and before `>`.
## About
With this bot, users gain or lose points when their messages are reacted to with upvote or downvote emojis by other users! Users can reset all of their points, or transfer them to another user's account! There are lots of possibilities for what to do with this bot! You could sell cat pictures to your friends, or just use it as a reddit-esque karma system!
## Commands
### Public
##### !e wallet
Used to check a user's account balance. 
<br>
Syntax: `!e wallet`
##### !e pay
Used to send your points to another user if you wish!
<br>
Syntax: `!e pay @user <amount | number>`
<br>
**Note:** Sending amount cannot be 0 or below it. (Otherwise you could steal money from people)
##### !e reset
Resets all of a user's points.
<br>
Syntax: `!e reset`
### Admin
**Note:** These commands are only usable by administrators.
##### !e admin wallet 
Allows you to check the wallet of any users.
<br>
Syntax: `!e admin wallet @user`
##### !e admin update
Allows you to add or remove points from any user's account. Example: If a user has 10 points and `!e admin edit @sameuser 5` is used, their point balance will be increased to 15 (10 + 5 = 15). If the number defined is negative the user will lose points in the same way.
<br>
Syntax: `!e admin edit @user <amount | number>`
## Credit
This project was a collaboration with [TheOkayGuy](https://www.youtube.com/channel/UCtdzdofrVMY_BngbnEDnzrA), go check out his stuff and sub!
