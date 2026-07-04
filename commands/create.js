import { intro, log, outro, text } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { execa } from 'execa';

export default function registerCreateCommand(program) {
    const CWD = process.cwd();
    const isDevelopment = process.env.NODE_ENV === 'development';
    program.command('create')
    .description('Create a new MERN stack application')
    .action(async () => {
        intro('Creating your MERN application...');
        const name = await text({
            message: 'What is the name of your application?',
            placeholder: 'my-mern-app',
            validate(value) {
                if (!value) return 'Name cannot be empty';
            },
        });
        const clientPath = path.join(CWD, (isDevelopment ? `/fake/client` : `client`));
        const serverPath = path.join(CWD, (isDevelopment ? '/fake/server' : '/server'));
        const reactOriginalPath = (isDevelopment ? `/fake/${name}` : name)
        await execa('npx', [
                'create-vite@latest',
                reactOriginalPath,
                '--',
                '--template',
                'react-ts',
                ], {
                stdout: 'ignore',
                stderr: 'inherit',
            })
            .then(async () => {
                await fs.move(path.join(CWD, reactOriginalPath), clientPath);
            });
        log.step(`Created client directory at ${clientPath}`);
        await fs.ensureDir(serverPath);
        log.step(`Created server directory at ${serverPath}`);

        outro('Application created successfully!');
    });
}    