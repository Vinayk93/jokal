#!/usr/bin/env node
/**
 * cli app for jokal to 
 * start the server 
 * stop the server
 * boilerplate
 * 
 */

const program       = require('commander');

program
  .version('0.1.0')
  .option('s, start', 'Start the server')
  .option('P, port', 'Add port')
  .option('c, stop', 'Stop the server')
  .option('sk, skip', 'skip the port no')
  .option('t, template ', 'boilerplate to start coding','location')
  .parse(process.argv);

  require('./cli')(program);