#!/usr/bin/env node
import { Command } from 'commander'; 

import dotenv from 'dotenv';
dotenv.config();

import { intro, outro, log, select, text } from '@clack/prompts';
import registerCreateCommand from './commands/create.js';

const mb = new Command();
const values = {}

mb.name('mern-builder')
  .description('A CLI tool to scaffold a MERN stack application')
  .version('0.0.1-BETA');


const run = () => {
  registerCreateCommand(mb);
  mb.parse(process.argv);
}

run();
