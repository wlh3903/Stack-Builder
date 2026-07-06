import { intro, log } from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";
import path from "path";
import fs from 'fs-extra';

async function initializePrisma(serverPath) {
  const spinner = ora('Installing Prisma...').start();
  spinner.color = 'cyan';
  await execa('npm', ['install', 'prisma', '-D', '@prisma/client'], { cwd: serverPath, stdout: 'inherit', stderr: 'inherit' });
  const response = await execa('npx', ['prisma', 'init'], { cwd: serverPath, stderr: 'inherit' });
  const output = response.stdout;
  log.message(output);
  spinner.succeed(`Prisma has been initialized in ${serverPath}`);
}

export default function registerPrismaCommand(program, createdIsRun) {
  const CWD = process.cwd();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const serverPath = path.join(CWD, (isDevelopment ? '/fake/server' : '/server'));
  const prismaPath = path.join(serverPath, 'prisma');
  program.command('prisma')
    .description('Initialize Prisma in your project')
    .option('--uri <string>', 'Database connection URI')
    .hook('preAction', async () => {
      if (!createdIsRun) {
        await log.message(chalk.redBright('You need to run the create command first to initialize your project.'));
        process.exit(1);
      }
    })
    .action(async (options) => {
      const noOptionsProvided = Object.keys(options).length === 0;
      if (noOptionsProvided) {
        await initializePrisma(serverPath);
        process.exit(0)
      }
      const {uri} = options;
      if (uri) {
        const envFilePath = path.join(serverPath, '.env');
        const envContent = `DATABASE_URL="${uri}"\n`;
        const currentEnvContent = await fs.readFile(envFilePath);
        await fs.writeFile(envFilePath, { ...currentEnvContent, ...envContent });
        log.message(chalk.greenBright(`Database connection URI has been set in ${envFilePath}`));
      }
    })
}