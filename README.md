# slack-issuebot
A slack bot to make linking and creating GitHub issues easier

## Requirements
- node.js

## Installation
1. Create a [new slack bot](http://my.slack.com/services/new/bot)
2. Clone this repository on your server
3. Run the node server with `token=your_slackbot_token node issuebot.js`
  - You can also set a default organization that will persist between server resets that doesn't depend on storage via `token=your_slackbot_token organization=affinio node issuebot.js`
4. `/invite issuebot` to your channels/groups

## Usage
In your slack chat where issuebot is a member try the following commands

- `issuebot help`
- `affinio/slack-issuebot#1`
- `issuebot set default organization affinio`
- `slack-issuebot#1`

## Development
Follow Installation instructions on your local machine
