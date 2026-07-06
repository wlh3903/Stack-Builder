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
import { verifyCreate } from './services/verifyCreate.js';

const stackBuilder = new Command();
const values = {}

stackBuilder.name('stack-builder')
  .description('A CLI tool to scaffold a MERN stack application')
  .version('1.0.1-BETA');


const run = async () => {
  const CWD = process.cwd();
  const created = await verifyCreate(CWD);
  registerCreateCommand(stackBuilder);
  registerPrismaCommand(stackBuilder, created);
  stackBuilder.parse(process.argv);
}

await run();
