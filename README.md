<p align="center">
  <h1 align="center">Serverless Counter</h1>
  <p align="center">
    A simple serverless counting API with Azure functions in Typescript.
  </p>
</p>

<p align="center">
  <a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
  "https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=alert_status"
  alt="Quality gate status" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
  "https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=reliability_rating"
  alt="Reliability rating" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
  "https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=vulnerabilities"
  alt="Vulnerabilities" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
  "https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=bugs"
  alt="Bugs" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
  "https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=code_smells"
  alt="Code smells" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
  "https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=coverage"
  alt="Coverage" /></a>
</p>

<p align="center">
  <a href="https://github.com/GuilhermeMGBR/ServerlessCounter/actions?query=branch%3Amain"><img src="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/sonarcloud-coverage.yml/badge.svg?event=push&branch=main" alt="SonarCloud CI status" /></a>
  <a href="https://github.com/GuilhermeMGBR/ServerlessCounter/actions?query=branch%3Amain">
    <img src="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/deploy.yml/badge.svg?event=push&branch=main" alt="Deploy CI status" />
  </a>
  <img src="https://img.shields.io/badge/created%20by-@guilhermemgbr-4BBAAB.svg" alt="Created by Guilherme Garcia">
  <a href="https://github.com/GuilhermeMGBR/ServerlessCounter" rel="nofollow"><img src=
  "https://img.shields.io/github/package-json/v/GuilhermeMGBR/ServerlessCounter?filename=src/package.json&color=red"
  alt="License"></a>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/GuilhermeMGBR/ServerlessCounter" alt="License"></a>
</p>

## Index

- [About the application](#about-the-application)
  - [Tecnologies](#tecnologies)
  - [Tools](#tools)
- [Setup](#setup)
- [Development](#development)
- [Continuous integration](#continuous-integration)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About the application

A simple serverless counting API with Azure functions in Typescript. Proof of concept and template for greater APIs!

### Tecnologies

- [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) as serverless infrastructure
- [Node.js](https://nodejs.org) as cross-platform JavaScript runtime environment
- [MySQL 2](https://github.com/sidorares/node-mysql2) as MySQL client for Node.js
- [Typescript](http://typescriptlang.org) as a strongly typed programming language
- [Zod](https://github.com/colinhacks/zod) for type schema validation

### Tools

- [Yarn](https://yarnpkg.com) as package manager
- [Babel](https://babeljs.io) for high performance javascript compilation
- [Prettier](http://prettier.io) for code formatting and better commits/diffs
- [Jest](http://jestjs.io) for testing
- [Sonar](https://www.sonarsource.com) for code analysis
- [Docker](https://www.docker.com) for local testing and simulation
- [Act](https://github.com/nektos/act) for local GitHub workflows testing and execution

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Setup

<details><summary>Environment configuration</summary>

#### Create a `local.settings.json` file

- Inside the `./src` folder. Sample:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "DB_COUNTER_CONNECTIONSTRING": "{{DEV_DB_CONNECTIONSTRING}}"
  }
}
```

- Configure your MySQL database of choice:
  - Replace `{{DEV_DB_CONNECTIONSTRING}}` with your connection string
  </details>

<details><summary>Dependencies</summary>

- Open the terminal inside the `src` folder
- Install dependencies with [yarn](https://yarnpkg.com)

```bash
yarn
```

</details>

<details><summary>Recommended VS Code extensions:</summary>

- [SonarLint](https://marketplace.visualstudio.com/items?itemName=sonarsource.sonarlint-vscode) - Code linting
- [ES Lint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - JavaScript linting
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors) - Prettier and human-readable TypeScript errors
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) - Highlighting of errors and other language diagnostics
- [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) - Lightweight Rest API Client
- [MySQL client](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2) - MySQL database client
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Development

<details><summary>Running locally</summary>

### Build and run the App:

This will install the required dependencies, build and start!

```bash
yarn start
```

### Make HTTP requests to the local Azure functions:

Getting the current value of the `testNamespace/testCounter` counter:

```shell
curl -X GET \
  'http://localhost:7071/api/get/testNamespace/testCounter' \
  --header 'Accept: */*'
```

- To start without installing dependencies or re-building the app:

```bash
yarn start:only
OR
yarn so
```

</details>

<details><summary>Manual build</summary>

### Run the build command:

This will install the dependencies and run a build

```bash
yarn build
```

- To run a build without installing dependencies:

```bash
yarn build:only
OR
yarn bo
```

- The build can re-run after each file save in watch mode

```bash
yarn watch:build
OR
yarn wb
```

</details>

<details><summary>Testing</summary>

Make sure to have installed dependencies from the initial setup

### Build and run tests:

```bash
yarn test
```

- The test can re-run after each file save in watch mode

```bash
yarn watch:test
OR
yarn wt
```

</details>

<details><summary>Type check</summary>

Make sure to have installed dependencies from the initial setup

### Run type check:

```bash
yarn type-check
OR
yarn tc
```

- The type check can re-run after each file save in watch mode

```bash
yarn watch:type-check
OR
yarn wtc
```

</details>

<details><summary>Pipeline validation</summary>

We can run pipeline workflows/ jobs/ steps locally with the help of [Nektos/act](https://github.com/nektos/act):

- Make sure you have Docker installed on your local machine
- Install [Nektos/act](https://github.com/nektos/act)
- Add the secrets required by the chosen pipeline at a `.secrets` file at this repository's root folder (same folder as the Readme)
- Open a terminal inside the [package.json](./src/package.json) folder
- Run the script with the desired pipeline to validate:
  - It will download a docker container and run the pipeline inside it, the first run may take a while!

```bash
yarn act:sonarcloud
yarn act:deploy
```

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Continuous integration

<details><summary>Deploy</summary>

Automatic build and deploy. Follows the triggers set in the GitHub workflow.

The following secrets must be configured on GitHub:

- AZURE_SUBSCRIPTION_ID
- AZURE_CLIENT_ID
- AZURE_TENANT_ID
- AZURE_FUNCTIONAPP_PUBLISH_PROFILE

</details>

<details><summary>Code analysis</summary>

Automatic code analysis with Sonarcloud. To include code coverage, follows the triggers set in the GitHub workflow.

The following secrets must be configured on GitHub:

- SONARCLOUD_ORGANIZATION
- SONARCLOUD_TOKEN

This also follows the properties defined inside the `sonar-project.properties` file, overwriting duplicates.

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## License

This project is licensed under the **MIT license**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Acknowledgements

The idea for this proof of concept emerged after using the free counting service [CountAPI](https://countapi.xyz) on some internal integration tests. We are using the same URL structure!

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

<p align="right">
<a href="https://sonarcloud.io/summary/new_code?id=Serverless-Counter"><img src=
"https://sonarcloud.io/images/project_badges/sonarcloud-black.svg"
alt="SonarCloud" /></a>
</p>
