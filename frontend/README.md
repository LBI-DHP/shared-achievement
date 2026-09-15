# Shared achievement

This is a pedometer app that you can use as a team and collect achievements together.

There are two different modes: isSingleUser: true/false -> can be set in AppView.txt

To-dos are marked with // TODO/To-do/TO-DO

# Get Started
## Set Environment Variables

Make sure you have the `.env` file that contains the environment variables needed to run the project. Request this file from other developers in your team. This file is not stored in the git repo as it contains sensitive values.

If the `.env` variable is not properly read (in the logs `apiUrl undefined`) use
```bash
dotenv run expo start
```
This will ensure the `.env` variables are loaded.

## Encode Configuration Files

### 1. Encode Files

```bash
cat google-services.json | base64
```
### 2. Update package.json Scripts

```json
"eas-build-pre-install": "echo $GOOGLE_SERVICES_FILE | base64 --decode > ./google-services.json"
```
### 3. Add Encoded Strings as Secrets to EAS

- GOOGLE_SERVICES_FILE: Base64-encoded content of google-services.json.
## Install the Project Dependencies

```bash
npm install
```

# Run on Android

## Run on Emulator

```bash
npx expo run:android
```

## Run on Physical Device

```bash
npx expo run:android -d
```

# Run on iOS

## Run on Emulator

```
npx expo run:ios
```

## Run on Physical Device

```bash
npx expo run:ios -d
```

# Build App

## ‼️ Increment the build number ‼️

> "version" (in package.json & app.json)

> "runtimeVersion" (in app.json)

## Clean prebuild 

```
npx expo prebuild --clean
```

## Run project

> described above

## Build APK 

```bash
eas build -p android --profile preview 
```

## Build iOS

```bash
eas build --platform ios
```

## Submit to AppStore 

```bash 
eas submit -p ios --latest
```
## License

Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention.

Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
with the [Commons Clause](https://commonsclause.com/) License Condition v1.0.
You may use, modify and redistribute this software, but you may not Sell it —
that is, you may not provide to third parties, for a fee or other consideration,
a product or service whose value derives entirely or substantially from this
software's functionality.

See [LICENSE](../LICENSE) for the full terms.
