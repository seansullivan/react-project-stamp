const shell = require('shelljs');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

(async () => {
    try {
        const questions = [
            {
                name: 'destination',
                message: 'Where to stamp it?',
                default: process.cwd()
            },
            {
                name: 'projectName',
                message: 'What to call it?',
                default: 'my-new-react-stamp'
            }
        ];

        const results = await inquirer.prompt(questions);

        const projectPath = `${results.destination}/${results.projectName}`;

        const { confirmation } = await inquirer.prompt([{
            name: 'confirmation',
            type: 'confirm',
            message: `Stamp out project in ${projectPath}?`
        }]);

        if (!confirmation) {
            console.log(chalk.red('nevermind then...'));

            return;
        }

        const root = path.resolve(projectPath);
        const projectName = path.basename(root);

        fs.ensureDirSync(root);

        const REACT_STARTER_REPO = 'git@github.com:seansullivan/react-starter.git';

        shell.exec(`git clone --depth=1 ${REACT_STARTER_REPO} ${projectName} && rm -rf ${root}/.git`);
        shell.exec(`cd ${root} && ~/.nvm/nvm.sh use && yarn`);
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(chalk.red(e));
    }
})();
