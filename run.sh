#!/bin/sh
$2npm install
token=$1 $2node $3issuebot.js
