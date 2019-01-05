'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const gitUrlParse = require('git-url-parse');
const gitConfig = require('gitconfiglocal');
const findParentDir = require('find-parent-dir');
const gitBranch = require('git-branch');
const path = require('path');
const open = require('open');
// import pify from 'pify';

const stashDomain = vscode.workspace.getConfiguration('openInStash').get('stashDomain', '');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-open-in-stash" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('extension.openInStash', openInStashPovider));
}

// const openInStashPR = (args: any) => {

// };

const openInStashPovider = (args: any) => {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if( !stashDomain ) {
        vscode.window.showErrorMessage('Stash domain is not specified, please set it in workspace configuration');
    }

    if (editor) {
        const fileFsPath: string = editor.document.fileName;

        var repoDir = findParentDir.sync(fileFsPath, '.git');
        if (!repoDir) {
            throw Error('Cant locate .git repository for this file');
        }
        
        gitConfig(repoDir, (err: any, config: any) => {
            if (err || !config) {
                throw Error('Unable get git config');
            }
            const gitUrl: string = gitUrlParse(config.remote.origin.url);
            const branch = gitBranch.sync(repoDir);

            let formattedFilePath: string = path.relative(repoDir, fileFsPath).replace(/\\/g, '/');
            formattedFilePath = formattedFilePath.replace(/\s{1}/g, '%20');
            const filePath: string = repoDir !== fileFsPath ? '/' + formattedFilePath : '';

            const url = webUrl(stashDomain, gitUrl, branch, filePath);
            open(url);
        });

    }

};

const webUrl = (baseUrl:string = stashDomain, gitUrl: any, branch: string, filePath: string):string => {
    return `${baseUrl}/projects/${gitUrl.owner}/repos/${gitUrl.name}/browse` 
        + (filePath ? `${filePath}` : '') 
        + (branch ? `?at=refs/heads/${branch}` : '');
};

// this method is called when your extension is deactivated
export function deactivate() {
}

