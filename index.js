#!/usr/bin/env node
import { Command } from 'commander'; 
import fs from 'fs-extra';
import path from "path";

import dotenv from 'dotenv';
dotenv.config();

import { intro, outro, log, select, text } from '@clack/prompts';
import registerCreateCommand from './commands/create.js';
import { create } from 'domain';
import registerPrismaCommand from './commands/prisma.js';

const stackBuilder = new Command();
const values = {}

stackBuilder.name('mern-builder')
  .description('A CLI tool to scaffold a MERN stack application')
  .version('0.0.1-BETA');


const run = async () => {
  const CWD = process.cwd();
  const created = await fs.readJson(path.join(CWD, '.cli-state.json'))
  const createIsRun = created.create;
  registerCreateCommand(stackBuilder);
  registerPrismaCommand(stackBuilder, createIsRun);
  stackBuilder.parse(process.argv);
}

await run();
