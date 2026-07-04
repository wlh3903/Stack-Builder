#!/usr/bin/env node
import { Command } from 'commander'; 

const mb = new Command();

mb.name('mern-builder')
  .description('A CLI tool to scaffold a MERN stack application')
  .version('0.0.1-BETA');

mb.command('create')
  .description('Create a new MERN stack application')
  .argument('<project-name>', 'Name of the new MERN stack application')
  .action((projectName) => {
    console.log(`Creating a new MERN stack application: ${projectName}`);
    // Add logic to scaffold the MERN stack application here
  });

mb.parse(process.argv);