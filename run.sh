#!/bin/sh
$2npm install $3
token=$1 $2node $3issuebot.js
