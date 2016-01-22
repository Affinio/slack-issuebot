/*
  Slack Issue Bot
  Copyright Affinio 2016
  MIT License
  github.com/Affinio/slack-issuebot
*/

var messageEvents = ["direct_message","direct_mention","mention","ambient"];

//**** Setup
  if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
  }

  var Botkit = require('botkit');

  var controller = Botkit.slackbot({
    debug: process.env.debug ? process.env.debug : false,
    json_file_store: './storage/config'
  });

  var bot = controller.spawn({
    token: process.env.token
  });

  bot.startRTM(function(err,bot,payload) {
    if (err) { throw new Error('Could not connect to Slack'); }
  });
//**** End Setup

//**** Bot help
  controller.on('channel_joined', function(bot, message){
    bot.say({
      text: "issuebot at your service! For help type `issuebot help`",
      channel: message.channel.id
    });
  });

  controller.hears("issuebot (help|command)", messageEvents, function(bot, message){
    bot.reply(message, "Hi, here are the commands I understand:");
    bot.reply(message, "You can set a default username or organization with `issuebot set default organization affinio`");
    bot.reply(message, "You can get an issue link by typing `organizationname/reponame#123`");
    bot.reply(message, "If you have set a defualt organization you can use `reponame#123`");
  });
//**** End bot help

//**** Bot configuration
  controller.hears("issuebot set default (organization|username) ([A-Za-z0-9-]+[^-]$)", messageEvents, function(bot, message){
    var organization = message.text.match(/issuebot set default (organization|username) ([A-Za-z0-9-]*[^-]$)/);
    if (organization && organization.length === 3){
      controller.storage.teams.save({id: "organization", organization:organization[2]}, function(err) {
        if (err){
          bot.reply(message, "There was an error please report it and/or contact your slack maintainer https://github.com/affinio/slack-issuebot/issues");
        }
        else {
          bot.reply(message, "I have set your default organization to `"+organization[2]+"`\nYou can now say `reponame#123` and I will link to this organization");
        }
      });
    } // if we got the proper organization info
    else {
      bot.reply(message, "Organization name not found. Try: `issuebot set default organization orgname`");
    }
  });
//**** End bot configuration

//**** Repository parsing
  // Detect a user/org with repo and issue: username/reponame#123
  controller.hears("([A-Za-z0-9_.-]+[^-])\/([A-Za-z0-9_.-]+)#([0-9]+)", messageEvents, function(bot,message) {
    var repositoryMessage = message.text.match(/([A-Za-z0-9_.-]+[^-])\/([A-Za-z0-9_.-]+)#([0-9]+)/);
    if (repositoryMessage && repositoryMessage.length === 4){
      var username = repositoryMessage[1];
      var reponame = repositoryMessage[2];
      var issueNum = repositoryMessage[3];
      bot.reply(message, "https://github.com/"+username+"/"+reponame+"/issues/"+issueNum);
    } // if we got proper repository information
    else { bot.reply(message, "Error parsing repository information"); }
  });

  // Detect a repo with issue: reponame#123
  controller.hears("([A-Za-z0-9_.-]+)#([0-9]+)", messageEvents, function(bot,message) {
    var repositoryMessage = message.text.match(/([A-Za-z0-9_.-]+)#([0-9]+)/);
    if (repositoryMessage && repositoryMessage.length === 3){
      controller.storage.teams.get("organization", function(err, data){
        if (err){ console.log(err); }
        if (data){
          var reponame = repositoryMessage[1];
          var issueNum = repositoryMessage[2];
          bot.reply(message, "https://github.com/"+data.organization+"/"+reponame+"/issues/"+issueNum);
        }
        else {
          bot.reply(message, "issue detected but no default organization/username set. You can set one with: `issuebot set default organization affinio`");
        }
      });
    } // if we got proper repository information
    else { bot.reply(message, "Error parsing repository information"); }
  });
//**** End repository parsing
