# Open in Stash Atlassian

**Supports :** Stash Atlassian

> Extension for Visual Studio Code which can be used to jump to a source code line in Stash Atlassian


## Install

**Tested with VsCode 1.29.1**  

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

![installation](screenshots/install.png?raw=true "installation")

Simply pick the `Open in Stash` extension from the list

## Install Manual

### Mac & Linux

```sh
cd $HOME/.vscode/extensions
git clone https://github.com/glebv/vscode-open-in-stash.git
cd vscode-open-in-stash
yarn install
```

### Windows

```sh
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/glebv/vscode-open-in-stash.git
cd vscode-open-in-stash
yarn install
```

## Usage

### Command

Press <kbd>F1</kbd> and type `Open in Stash`.

![open](screenshots/open-in-stash.png?raw=true "Open function")


### Configure custom github domain

Add following line into workspace settings;

```js
{
  "openInStash.stashDomain": "your custom github domain here",
}
```

**Enjoy!**

#### TODO
* tests
