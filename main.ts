const economy = new discord.command.CommandGroup({
  defaultPrefix: '!'
});

const kv = new pylon.KVNamespace('GuyCoin KV Namespace');

// point incrementation function (from pylon docs; https://pylon.bot/docs/pylon-kv#using-transact-to-build-atomic-counters)
async function incrementPts(key: string, by: number = 1): Promise<number> {
  const nextValue = await kv.transact<number>(key, (prevValue = 0) => {
    // This function may be invoked multiple times to deal with write conflicts.
    // Return the `nextValue` that should be set to the key. You cannot await promises
    // or do any IO in this function. It's purpose is to purely transform `prevValue`
    // into `nextValue`. In this case, we are incrementing it.
    return prevValue + by;
  });

  // `.transact` may return `T | undefined`, but since we're never returning undefined from the
  // transaction function, we can use `!` to tell typescript that the value won't be undefined.
  return nextValue!;
}

economy.subcommand('e', (subCommandGroup) => {
  subCommandGroup.raw('wallet', async (message) => {
    // get wallet data
    var points = await kv.get<number>(message.member.user.id);
    // if wallet value is null (new player) set it to 0
    if (points == null || points == undefined) {
      await kv.put(message.member.user.id, 0);
      // check wallet again
      points = await kv.get<number>(message.member.user.id);
    }
    // reply with points
    await message.reply('Point balance: ' + points);
  });

  subCommandGroup.raw('help', async (message) => {
    const economyHelpEmbed = new discord.Embed();
    economyHelpEmbed.setTitle('Economy Bot Help');
    economyHelpEmbed.setColor(16728882);
    economyHelpEmbed.setDescription(
      'Use the commands below to upvote/downvote and do many other cool things!'
    );
    economyHelpEmbed.addField({
      name: '!e wallet',
      value:
        'If you want to know what your current point count is, use the wallet command. *`!e wallet`*'
    });
    economyHelpEmbed.addField({
      name: '!e pay',
      value:
        'The pay command allows you to, well, *pay* other users! *`!e pay @user <amount | must be a number>`*'
    });
    economyHelpEmbed.addField({
      name: '!e reset',
      value: 'Use this to reset all of your points. *`!e reset`*'
    });
    economyHelpEmbed.addField({
      name: 'Voting',
      // IMPORTANT: ADD YOUR OWN EMOJIS VALUES HERE HERE!
      value:
        'Upvote using the <:upvote:emoji_id> upvote emoji someone else if they said something funny or particularly noteworthy. You can also downvote with <:downvote:emoji_id> if someone said something you did not like!'
    });

    economyHelpEmbed.setTimestamp(new Date().toISOString());

    await message.reply(economyHelpEmbed);
  });

  subCommandGroup.on(
    {
      name: 'pay'
    },
    (ctx) => ({
      user: ctx.guildMember(),
      amount: ctx.number()
    }),
    async (message, { user, amount }) => {
      var senderPts = await kv.get<number>(message.member.user.id);
      if (senderPts == null) {
        await kv.put(message.member.user.id, 0);
        await message.reply('Error: Insufficient funds.');
      }
      if (senderPts >= amount) {
        if (amount < 0 || amount == 0) {
          await message.reply(
            'Error: Invalid value. Choose a positive number.'
          );
        } else {
          // increment the sender's account by negative the amount defined
          incrementPts(message.member.user.id, amount * -1);
          // increment the recipient's account by the amount defined
          incrementPts(user.user.id, amount);
          // confirm transaction
          await message.reply(
            `Wired ${amount} points to ${user.toMention()}'s account.`
          );
        }
      } else {
        await message.reply('Error: Insufficient funds.');
      }
    }
  );

  subCommandGroup.raw('reset', async (message) => {
    await message.reply(
      'Are you SURE you want to reset? You will lose all of your points. Type `!gc confirm` to confirm.'
    );
  });
  subCommandGroup.raw('confirm', async (message) => {
    await kv.put(message.member.user.id, 0);
    await message.reply('Point balance successfully reset.');
  });

  // Admin only commands
  subCommandGroup.subcommand('admin', (subCommandGroup) => {
    subCommandGroup.on(
      {
        name: 'edit',
        filters: discord.command.filters.isAdministrator()
      },
      (ctx) => ({
        user: ctx.guildMember(),
        amount: ctx.number()
      }),
      async (message, { user, amount }) => {
        incrementPts(user.user.id, amount);
        await message.reply(
          `Wired ${amount} points to ${user.toMention()}'s account.`
        );
      }
    );

    subCommandGroup.on(
      {
        name: 'wallet',
        filters: discord.command.filters.isAdministrator()
      },
      (ctx) => ({
        user: ctx.guildMember()
      }),
      async (message, { user }) => {
        var currentUserPts = await kv.get<number>(user.user.id);
        if (currentUserPts == null || currentUserPts == undefined) {
          await kv.put(user.user.id, 0);
        }
        await message.reply(
          `${user.toMention()} currently has ${currentUserPts} points.`
        );
      }
    );
  });
});

const UPVOTE_ID = 'Your upvote emoji ID';
const DOWNVOTE_ID = 'Your downvote emoji ID';

// upvote reaction
discord.on('MESSAGE_REACTION_ADD', async (data) => {
  if (data.emoji.id === UPVOTE_ID) {
    let guild = discord.getGuild();
    let guildChannel = await discord.getTextChannel(data.channelId);
    let message = await guildChannel.getMessage(data.messageId);
    let author = message.author;
    const channel = await discord.getTextChannel(data.channelId);
    if (data.member.user.id == author.id) {
      await channel?.sendMessage("Hey, you can't upvote yourself!");
      await channel?.sendMessage(
        'https://tenor.com/view/smh-kanyewest-gif-4544077'
      );
    } else {
      incrementPts(author.id, 1);
    }
  }
});

discord.on('MESSAGE_REACTION_REMOVE', async (data) => {
  if (data.emoji.id === UPVOTE_ID) {
    let guild = discord.getGuild();
    let guildChannel = await discord.getTextChannel(data.channelId);
    let message = await guildChannel.getMessage(data.messageId);
    let author = message.author;
    if (data.member.user.id !== author.id) {
      const channel = await discord.getTextChannel(data.channelId);
      incrementPts(author.id, -1);
    }
  }
});

// downvote reaction
discord.on('MESSAGE_REACTION_ADD', async (data) => {
  if (data.emoji.id === DOWNVOTE_ID) {
    let guild = discord.getGuild();
    let guildChannel = await discord.getTextChannel(data.channelId);
    let message = await guildChannel.getMessage(data.messageId);
    let author = message.author;
    const channel = await discord.getTextChannel(data.channelId);
    if (data.member.user.id == author.id) {
      await channel?.sendMessage("Hey, don't be too hard on yourself!");
      await channel?.sendMessage(
        'https://tenor.com/view/its-ok-pat-comfort-joseph-gordon-levitt-hug-gif-5874325'
      );
    } else {
      incrementPts(author.id, -1);
    }
  }
});

discord.on('MESSAGE_REACTION_REMOVE', async (data) => {
  if (data.emoji.id === DOWNVOTE_ID) {
    let guild = discord.getGuild();
    let guildChannel = await discord.getTextChannel(data.channelId);
    let message = await guildChannel.getMessage(data.messageId);
    let author = message.author;
    if (data.member.user.id !== author.id) {
      const channel = await discord.getTextChannel(data.channelId);
      incrementPts(author.id, 1);
    }
  }
});
