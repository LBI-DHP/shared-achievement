# Shared achievement

This is a pedometer app that you can use as a team and collect achievements together.

There are two different modes: isSingleUser: true/false -> can be set in AppView.txt

To-dos are marked with // TODO/To-do/TO-DO

## Get Started

To run this project, you need a recent version of [Node.js](https://nodejs.org/en/) (Node 12 LTS or later).

Install the Expo CLI command line utility via npm:

```bash
npm install -g expo-cli
```

## Installation

Run the following command in the project directory to install the project dependencies.

```bash
npm install
```

## Run the project

Make sure you have the `.env` file that contains the environment variables needed to run the project. Request this file from other developers in your team. This file is not stored in the git repo as it contains sensitive values.

To run the project in **development** mode, navigate to the project directory and run the following expo command:

```bash
npx expo start
```
If the `.env` variable is not properly read (in the logs `apiUrl undefined`) use
```bash
dotenv run expo start
```
This will ensure the `.env` variables are loaded.

To run the project in **production** mode, navigate to the project directory and run the following expo command:

```bash
npx expo start --no-dev --minify
```

The expo-cli should pop up and you are ready to go.

To test the application on your mobile phone, download the Expo app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=US) / [IOS](https://apps.apple.com/at/app/expo-go/id982107779)), create a profile and log in on the expo-cli and on your mobile phone. Make sure all your devices are connected to the same WIFI and off you go.

## Build

Following [this Guide](https://docs.expo.dev/build/setup/#1-install-the-latest-eas-cli) use the EAS-CLI to build binaries from our codebase.

Setup:

- Install the latest EAS CLI
  `npm install -g eas-cli`
- Login to the LBI Expo account
  `eas login`
  verify with:
  `eas whoami`
- Configure the project
  `eas build:configure`
- If values in the `.env` file changed, make sure to update the corresponding secrets at: https://expo.dev/accounts/lbidhp/projects/shared-achievement/secrets
- Run a build
  `eas build`
  
  Credentials get generated or reused on a project basis, view them at the [expo.dev](expo.dev) site under your project under "Credentials". The keystore .jks file can be donloaded there if needed.

## Expo-cli has not yet been tested against Node.js v17.0.1.

[Check this link if you receive the following error message](https://github.com/webpack/webpack/issues/14532):

```bash
error: digital envelope routines::unsupported ERR_OSSL_EVP_UNSUPPORTED
```

Running `export NODE_OPTIONS=--openssl-legacy-provider` in the Git Bash before starting the project solved the problem for me.

If you are using the windows command line (CMD), then the run `set NODE_OPTIONS=--openssl-legacy-provider` before running "npm start" instead.
