# Economy-Discord-Bot
A basic economy system for Discord built with [Pylon.bot](https://pylon.bot)
## Setup
 - Invite [Pylon](https://pylon.bot) to your discord server (follow setup instructions there)
 - Copy and paste [the code](../main.ts) into your [Pylon editor](https://pylon.bot/studio) and change a few things to fit your server (below). 
 > Note: Currently we only support the use of custom server emojis for upvote/downvote emojis.
 - Line 61: Replace these emojis with an emoji of your choosing! To find out the syntax for a custom emoji on your server, just type `\:emoji:` (where ":emoji:" is the name of the emoji). The output should be something like `<:emoji:811314799676751884>`.
 - Line 154: Replace this text with the ID of an "upvote" emoji of your choosing! To figure out the ID type `\:emoji:`. The ID should come after `:emoji:` and before `>`. It will be a long number like `811314799676751884`.
 - Line 155: Replace this text with the ID of an "downvote" emoji of your choosing! To figure out the ID type `\:emoji:`. The ID should come after `:emoji:` and before `>`. It will be a long number like `811314799676751884`.
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
##### !e admin edit
Allows you to add or remove points from any user's account. Example: If a user has 10 points and `!e admin edit @user 5` is used, their point balance will be increased to 15 (10 + 5 = 15). If the number defined is negative the user will lose points in the same way.
<br>
Syntax: `!e admin edit @user <amount | number>`
## Support 
Visit the [support server](https://discord.gg/U4xC8ZP8QS) for any help or questions!
## Credit
This project was a collaboration with [TheOkayGuy](https://www.youtube.com/channel/UCtdzdofrVMY_BngbnEDnzrA), go check out his stuff and sub!
