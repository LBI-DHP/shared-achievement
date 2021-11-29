# Shared achievement 

This is a pedometer app that you can use as a team and collect achievements together.

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

To run the project, navigate to the project directory and run the following npm command:

```bash
npm start
```

The expo-cli should pop up and you are ready to go.

To test the application on your mobile phone, download the Expo app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=US) / [IOS](https://apps.apple.com/at/app/expo-go/id982107779)), create a profile and log in on the expo-cli and on your mobile phone. Make sure all your devices are connected to the same WIFI and off you go.

## Expo-cli has not yet been tested against Node.js v17.0.1.

[Check this link if you receive the following error message](https://github.com/webpack/webpack/issues/14532):
```bash
error: digital envelope routines::unsupported ERR_OSSL_EVP_UNSUPPORTED
```
Running `export NODE_OPTIONS=--openssl-legacy-provider` in the Git Bash before starting the project solved the problem for me.

If you are using the windows command line (CMD), then the run "set NODE_OPTIONS=--openssl-legacy-provider" before running "npm start" instead.
