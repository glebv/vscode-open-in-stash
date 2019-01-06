'use strict';

import * as vscode from 'vscode';
import * as gitUrlParse from 'git-url-parse';
import * as gitConfig from 'gitconfiglocal';
import * as findParentDir from 'find-parent-dir';
import * as gitBranch from 'git-branch';
import * as path from 'path';

const opn = require('opn');

const stashDomain = vscode.workspace.getConfiguration('openInStash').get('stashDomain', '');

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openInStash', openInStashPovider),
  );
}

const openInStashPovider = (args: any) => {
  const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
  if (!stashDomain) {
    vscode.window
    .showErrorMessage('Stash domain is not specified, please set it in workspace configuration');
  }

  if (editor) {
    const fileFsPath: string = editor.document.fileName;

    const repoDir = findParentDir.sync(fileFsPath, '.git');
    if (!repoDir) {
      throw Error('Cant locate .git repository for this file');
    }

    gitConfig(repoDir, (err, config) => {
      if (err || !config) {
        throw Error('Unable get git config');
      }

      const gitUrl: gitUrlParse.GitUrl = gitUrlParse(config.remote.origin.url);
      const branch = gitBranch.sync(repoDir as string);

      const formattedFilePath: string = path
        .relative(repoDir as string, fileFsPath)
        .replace(/\\/g, '/')
        .replace(/\s{1}/g, '%20');
      const filePath: string = repoDir !== fileFsPath ? `/${formattedFilePath}` : '';
      const selection = getSelectionLines(editor);

      let webUrl: WebUrl = {
        gitUrl,
        branch,
        filePath,
        baseUrl: stashDomain,
      };

      if (selection) {
        webUrl = { ...webUrl, ...selection };
      }

      const url = getUrl(webUrl);
      opn(url);
    });
  }
};

interface WebUrl {
  baseUrl: string;
  gitUrl: gitUrlParse.GitUrl;
  branch?: string;
  filePath?: string;
  startLine?: number;
  endLine?: number;
}

const getUrl = (args: WebUrl): string => {
  const { baseUrl, gitUrl, filePath, branch, startLine, endLine } = args;
  // tslint:disable-next-line
  return `${baseUrl}/projects/${gitUrl.owner}/repos/${gitUrl.name}/browse`
    + (filePath ? `${filePath}` : '')
    + (branch ? `?at=refs/heads/${branch}` : '')
    + (startLine ? `#${startLine}` : '')
    + (startLine && endLine ? `-${endLine}` : '');
};

interface SelectionLines {
  startLine?: number;
  endLine?: number;
}

const getSelectionLines = (editor: vscode.TextEditor): SelectionLines | undefined => {
  if (editor.selection.isSingleLine) {
    return {
      startLine: editor.selection.anchor.line + 1,
    };
  }
  return {
    startLine: editor.selection.anchor.line + 1,
    endLine: editor.selection.end.line + 1,
  };
};
