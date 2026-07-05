import { intro, log, outro, select, text } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { execa } from 'execa';
import ora from 'ora';
import { setTimeout } from "timers/promises";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { saveCreate } from "../services/saveCreate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '../templates');

const typeScriptTemplates = {
    'vanila': 'vanilla-ts',
    'vue': 'vue-ts',
    'react': 'react-ts',
    'preact': 'preact-ts',
    'lit': 'lit-ts',
    'svelte': 'svelte-ts',
    'solid': 'solid-ts',
    'qwik': 'qwik-ts'
}

async function getAppName() {
    return await text({
        message: 'What is the name of your application?',
        placeholder: 'my-mern-app',
        validate(value) {
            if (!value) return 'Name cannot be empty';
        },
    });
}

function getTemplate(langaugeType, template) {
    if (langaugeType === 'TypeScript') {
        return typeScriptTemplates[template];
    }
    return template;
}

async function initializeViteClient(clientOriginalPath, CWD, clientPath) {
    const languageType = [
        { value: 'JavaScript', label: chalk.green('JavaScript') },
        { value: 'TypeScript', label: chalk.blue('TypeScript') }
    ]

    const templateTypes = [
        { value: 'vanila', 'label': chalk.red('Vanilla') },
        { value: 'vue', 'label': chalk.blue('Vue') },
        { value: 'react', 'label': chalk.green('React') },
        { value: 'preact', 'label': chalk.yellow('Preact') },
        { value: 'lit', 'label': chalk.magenta('Lit') },
        { value: 'svelte', 'label': chalk.cyan('Svelte') },
        { value: 'solid', 'label': chalk.white('Solid') },
        { value: 'qwik', 'label': chalk.bold('Qwik') }
    ]

    const languagePreference = await select({
        message: 'Choose your preferred language:',
        options: languageType,
    });

    const templatePreference = await select({
        message: 'Choose your preferred template:',
        options: templateTypes,
    });

    const template = getTemplate(languagePreference, templatePreference);

    const spinner = ora('Initializing Vite client...').start();
    spinner.color = 'cyan';
    await execa('npx', [
        'create-vite@latest',
        clientOriginalPath,
        '--',
        '--template',
        template,
        ], {
        stdout: 'ignore',
        stderr: 'inherit',
    })
    .then(async () => {
        await fs.move(path.join(CWD, clientOriginalPath), clientPath);
    });
    spinner.text = 'Installing client dependencies...';
    const installProcess = await execa('npm', ['install'], { cwd: clientPath });
    log.message(installProcess.stdout);
    spinner.succeed(`Created client directory at ${clientPath}`);
}

async function initializeExpressServer(serverPath, CWD, appName) {
    //Spinner to indicate that the Express server is being initialized
    const spinner = ora('Initializing Express server...').start();
    spinner.color = 'cyan';
    
    const templateServer = path.join(templatesDir, '/server');
    const envTemplateFile = path.join(templatesDir, '/files/.envExample');
    spinner.text = 'Creating server from template...';
    await fs.ensureDir(serverPath);
    await fs.copy(templateServer, path.join(serverPath));
    await execa('npm', ['init', '-y'], { cwd: serverPath, stdout: 'ignore', stderr: 'inherit' });
    spinner.text = 'Initializing server folder...';
    await fs.copy(envTemplateFile, path.join(serverPath, '.env'));
    const currentPackage = await fs.readJson(path.join(serverPath, 'package.json'));
    await fs.writeJson(path.join(serverPath, 'package.json'), { ...currentPackage, name: appName + '-server' }, { spaces: 2 });
    spinner.text = 'Installing server dependencies...';
    const installProcess = await execa('npm', ['install'], { cwd: serverPath});
    log.message(installProcess.stdout);
    spinner.succeed(`Created server directory at ${serverPath}`);
}

export default function registerCreateCommand(program) {
    const CWD = process.cwd();
    const isDevelopment = process.env.NODE_ENV === 'development';
    const clientPath = path.join(CWD, (isDevelopment ? `/fake/client` : `client`));
    const serverPath = path.join(CWD, (isDevelopment ? '/fake/server' : '/server'));

    program.command('create')
    .description('Create a new MERN stack application ' + chalk.red('<MUST BE RUN FIRST>'))
    .action(async () => {
        intro('Creating your MERN application...');
        const appName = await getAppName();
        const clientOriginalPath = (isDevelopment ? `/fake/${appName}` : appName)
        await initializeViteClient(clientOriginalPath, CWD, clientPath);
        await initializeExpressServer(serverPath, CWD, appName);
        await saveCreate(CWD);
        outro(chalk.green(`Successfully created MERN application: ${appName}`));
    });
}    