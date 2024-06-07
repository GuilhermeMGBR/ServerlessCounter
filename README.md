<p align="center">
  <h1 align="center">Serverless Counter</h1>
  <p align="center">
    A simple serverless counting API with Azure functions in Typescript.
  </p>
</p>

<p align="center">
  <a href="https://sonarcloud.io/summary/overall?id=Serverless-Counter">
    <img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=alert_status"
      alt="Quality gate status"
    />
  </a>
  <a
    href="https://sonarcloud.io/component_measures?id=Serverless-Counter&metric=reliability_rating&view=list"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=reliability_rating"
      alt="Reliability rating"
  /></a>
  <a
    href="https://sonarcloud.io/project/issues?resolved=false&types=VULNERABILITY&id=Serverless-Counter"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=vulnerabilities"
      alt="Vulnerabilities"
  /></a>
  <a
    href="https://sonarcloud.io/project/issues?resolved=false&types=BUG&id=Serverless-Counter"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=bugs"
      alt="Bugs"
  /></a>
  <a
    href="https://sonarcloud.io/project/issues?resolved=false&types=CODE_SMELL&id=Serverless-Counter"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=code_smells"
      alt="Code smells"
  /></a>
  <a
    href="https://sonarcloud.io/component_measures?id=Serverless-Counter&metric=coverage&view=list"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-Counter&metric=coverage"
      alt="Coverage"
  /></a>
</p>

<p align="center">
  <a
    href="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/sonarcloud-coverage.yml?query=branch%3Amain"
  >
    <img
      src="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/sonarcloud-coverage.yml/badge.svg?event=push&branch=main"
      alt="SonarCloud CI status"
    />
  </a>
  <a
    href="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/deploy.yml?query=branch%3Amain"
  >
    <img
      src="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/deploy.yml/badge.svg?event=push&branch=main"
      alt="Deploy CI status"
    />
  </a>
  <a
    href="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/health-check.yml?query=branch%3Amain"
  >
    <img
      src="https://github.com/GuilhermeMGBR/ServerlessCounter/actions/workflows/health-check.yml/badge.svg?branch=main"
      alt="Health Check status"
    />
  </a>
  <a  href="https://github.com/GuilhermeMGBR?tab=overview&from=2023-02-01&to=2023-02-28">
    <img
      src="https://img.shields.io/badge/created%20by-@guilhermemgbr-4BBAAB.svg"
      alt="Created by Guilherme Garcia"
    />
  </a>
  <a href="https://github.com/GuilhermeMGBR/ServerlessCounter" rel="nofollow">
    <img
      src="https://img.shields.io/github/package-json/v/GuilhermeMGBR/ServerlessCounter?filename=src/package.json&color=red"
      alt="Version"
    />
  </a>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"
    ><img
      src="https://img.shields.io/github/license/GuilhermeMGBR/ServerlessCounter"
      alt="License"
  /></a>
</p>

## Index

- [About the application](#about-the-application)
  - [Technologies](#technologies)
  - [Tools](#tools)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Development](#development)
- [Continuous integration](#continuous-integration)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About the application

A simple serverless counting API with Azure functions in Typescript. Proof of concept and template for greater APIs!

- The `get` and `hit` endpoints are also stateless and can scale as far as your database and wallet allows.
- The endpoint behaviors (located within a service) can be utilized and deployed using a conventional Node.js server.

### Technologies

- [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) as serverless infrastructure
- [Node.js](https://nodejs.org) as cross-platform JavaScript runtime environment
- [MySQL 2](https://github.com/sidorares/node-mysql2) as MySQL client for Node.js
- [Typescript](http://typescriptlang.org) as a strongly typed programming language
- [Zod](https://github.com/colinhacks/zod) for type schema validation

### Tools

- [Yarn](https://yarnpkg.com) as package manager
- [Babel](https://babeljs.io) for high performance javascript compilation
- [Prettier](https://prettier.io) for code formatting and better commits/diffs
- [Jest](https://jestjs.io) for testing
- [SQLite](https://www.sqlite.org) for in memory SQL testing environment
- [Sonar](https://www.sonarsource.com) for code analysis
- [Husky](https://typicode.github.io/husky/) for git hooks
- [Docker](https://www.docker.com) for local testing and simulation
- [Act](https://github.com/nektos/act) for local GitHub workflows testing and execution

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Getting started

<details><summary>Environment configuration</summary>

#### Create a `local.settings.json` file inside the `./src` folder.

- Replace `{{YOUR_CONNECTIONSTRING}}` with the connection string to your MySQL database of choice

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",
    "DB_COUNTER_CONNECTIONSTRING": "{{YOUR_CONNECTIONSTRING}}",
    "DB_COUNTER_REJECTUNAUTHORIZED": "true",
    "DB_COUNTER_CA": "{{YOUR_CA}}"
  }
}
```

#### To run and debug functions locally, install [azure-functions-core-tools](https://github.com/Azure/azure-functions-core-tools) on your machine

Installation with yarn:

```bash
yarn global add azure-functions-core-tools
```

=> The 'devcontainer' comes with this preinstalled

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
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Lightweight Rest Client
- [MySQL client](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2) - MySQL database client
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - Git extensions
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter
- [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter) - Sort imports and lowers merge conflicts
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Spell checker

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Usage

Counters are identified by their `namespace`/`key` pair.

- The namespace must be unique, keys can repeat across different namespaces
- We can check the current counter value or add 1 to it.

The API endpoints follow this URL structure:

_`{{BaseURL}}`_`/api/`_`{{Action}}`_`/`_`{{Namespace}}`_`/`_`{{Key}}`_`?code=`_`{{Code}}`_

Where:

- {{BaseURL}} => URL to where the Azure function app is hosted
  - Azure (example): https://counter.azurewebsites.net
  - Local: http://localhost:7071
- {{Action}} => `get` to get the current value or `hit` to raise the count by 1
- {{Namespace}} => namespace of the desired counter
- {{Key}} => key of the desired counter
- {{Code}} => code required to authenticate requests to a deployed Azure Function

<details><summary>Get current value</summary>

Request:

```bash
curl -X GET http://localhost:7071/api/get/namespace1/key1?code=ABC --header 'Accept: */*'
```

Response:

```json
{
  "value": 1
}
```

Getting the value of a non-existent counter will return 0.

</details>

<details><summary>Raise the count</summary>

Request:

```bash
curl -X GET http://localhost:7071/api/hit/namespace1/key1?code=DEF --header 'Accept: */*'
```

Response:

```json
{
  "value": 2
}
```

Raising the count of a non-existent counter will create the counter and raise the count to 1.

</details>

<details><summary>Inspect API usage</summary>

Lists counter usage data and overall _active_ x _deleted_ status count.

```bash
curl -X GET http://localhost:7071/api/usage?code=XYZ --header 'Accept: */*'
OR
curl -X GET http://localhost:7071/api/usage/namespace1?code=XYZ --header 'Accept: */*'
OR
curl -X GET http://localhost:7071/api/usage/namespace1/key1?code=XYZ --header 'Accept: */*'
```

<details><summary>Inspect all namespace/key pairs</summary>

Request:

```bash
curl -X GET http://localhost:7071/api/usage?code=XYZ --header 'Accept: */*'
```

Response:

```json
{
  "activeCounters": [
    {
      "namespace": "namespace1",
      "key": "key1",
      "hits": 123,
      "createdAt": "2023-08-01T01:48:50.000Z",
      "lastHit": "2023-08-01T15:53:14.000Z"
    },
    {
      "namespace": "namespace1",
      "key": "key2",
      "hits": 456,
      "createdAt": "2023-08-01T02:50:50.000Z",
      "lastHit": "2023-08-01T16:55:14.000Z"
    },
    {
      "namespace": "namespace2",
      "key": "key1",
      "hits": 789,
      "createdAt": "2023-08-01T02:48:50.000Z",
      "lastHit": "2023-08-01T16:53:14.000Z"
    },
    ...
    {
      "namespace": "namespace1000",
      "key": "key1",
      "hits": 101112,
      "createdAt": "2023-08-01T04:48:50.000Z",
      "lastHit": "2023-08-01T17:53:14.000Z"
    }
  ],
  "status": {
    "active": "1285",
    "deleted": "25"
  }
}
```

</details>

<details><summary>Inspect all keys from one namespace</summary>

Request:

```bash
curl -X GET http://localhost:7071/api/usage/namespace1?code=XYZ --header 'Accept: */*'
```

Response:

```json
{
  "activeCounters": [
    {
      "namespace": "namespace1",
      "key": "key1",
      "hits": 123,
      "createdAt": "2023-08-01T01:48:50.000Z",
      "lastHit": "2023-08-01T15:53:14.000Z"
    },
    {
      "namespace": "namespace1",
      "key": "key2",
      "hits": 456,
      "createdAt": "2023-08-01T02:50:50.000Z",
      "lastHit": "2023-08-01T16:55:14.000Z"
    }
  ],
  "status": {
    "active": "2",
    "deleted": "1"
  }
}
```

</details>

<details><summary>Inspect a single namespace/key pair</summary>

Request:

```bash
curl -X GET http://localhost:7071/api/usage/namespace1/key1?code=XYZ --header 'Accept: */*'
```

Response:

```json
{
  "activeCounters": [
    {
      "namespace": "namespace1",
      "key": "key1",
      "hits": 123,
      "createdAt": "2023-08-01T01:48:50.000Z",
      "lastHit": "2023-08-01T15:53:14.000Z"
    }
  ],
  "status": {
    "active": "1",
    "deleted": "0"
  }
}
```

</details>

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Development

<details><summary>Running locally</summary>

### Build and run the App:

This will install the required dependencies, build and start!

```bash
yarn start
```

- To start without installing dependencies or re-building the app:

```bash
yarn start:only
OR
yarn so
```

=> Remember to follow the environment configuration from the [Getting started](#getting-started) before running the app!

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

<details><summary>Linting</summary>

### Run the lint command:

```bash
yarn lint
OR
yarn lt
```

</details>

<details><summary>Formatting</summary>

### Run the format command:

This will automatically fix errors where possible

```bash
yarn format
OR
yarn fmt
```

- To check formatting errors without making changes to files:

```bash
yarn format:check
OR
yarn fc
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

<details><summary>Sonar analysis</summary>

> An analysis is run automatically on `SonarCloud` for open `PRs` and changes to the `main` branch.

To run an analysis locally with SonarQube and Docker:

### Start a local SonarQube instance:

```bash
yarn sonar-server:start
OR
yarn ss
```

<details><summary>[Optional] Persist analysis results</summary>

To persist the analysis results when running a local server of SonarQube:

### Create a `.env.sonar-server.local` file inside the `./src` folder

```sh
SONAR_JDBC_URL={{YOUR_URL}} # sample: jdbc:postgresql://hostname.com/db_name
SONAR_JDBC_USERNAME={{YOUR_USERNAME}}
SONAR_JDBC_PASSWORD={{YOUR_PASSWORD}}
```

Replace placeholders with the connection values to your PostgreSQL instance:

- `{{YOUR_URL}}`
- `{{YOUR_USERNAME}}`
- `{{YOUR_PASSWORD}}`

> It is possible to run an instance of PostgreSQL inside another docker container!

### Start a local SonarQube instance with persistence:

```bash
yarn sonar-server:start-persistent
OR
yarn ssp
```

</details>

### Sonar Scanner configuration

Set environment variables with sonar server connection details:

- SONAR_HOST_URL
- SONAR_LOGIN

> They can be set inline, before the run command:
>
> ```bash
> SONAR_HOST_URL=https://your.local.url; SONAR_LOGIN=sqp_yourTokenXYZ; yarn sonar
> ```

### Run Sonar Scanner

```bash
yarn sonar
OR
yarn s
```

</details>

<details><summary>Pre-commit hook</summary>

> The `pre-commit` hook should run automatically before every commit through `Husky`.

To manually run all pre-commit checks:

```bash
yarn pre-commit
OR
yarn pc
```

This hook does type checking, linting, format checking, runs all tests and checks for blocked terms, stopping and showing errors from the first one to fail, if any.

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
yarn act:health-check
```

</details>

<details><summary>[optional] Source .secrets to local environment</summary>

> The secrets will be sourced from a `.secrets` file at this repository's root folder (same folder as the Readme)

To source local environment secrets on terminal open, add this to your `.bashrc` or `.zshrc`:

```sh
#
# Allow parent to initialize shell
#
if [[ -n $ZSH_INIT_COMMAND_SVRLSSCTR ]]; then
  echo "Running: $ZSH_INIT_COMMAND_SVRLSSCTR"
  eval "$ZSH_INIT_COMMAND_SVRLSSCTR"
fi
```

This will trigger a [dev-environment-init.sh](./.vscode/dev-environment-init.sh) run when using `Visual Studio Code` on `macOS`.

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Continuous integration

<details><summary>Code analysis</summary>

Automatic code analysis with Sonarcloud. To include code coverage, follows the triggers set in the GitHub workflow.

The following secrets must be configured on GitHub:

- SONAR_HOST_URL
- SONAR_ORGANIZATION
- SONAR_PROJECT_KEY
- SONAR_TOKEN

This also follows the properties defined inside the `sonar-project.properties` file, overwriting duplicates.

</details>

<details><summary>Deploy</summary>

Automatic build and deploy. Follows the triggers set in the GitHub workflow.

The following secrets must be configured on GitHub:

- AZURE_SUBSCRIPTION_ID
- AZURE_CLIENT_ID
- AZURE_TENANT_ID
- AZURE_FUNCTIONAPP_PUBLISH_PROFILE

</details>

<details><summary>Health Check</summary>

A health check will be made after each deploy and can also be manually triggered.

The following secrets must be configured on GitHub:

- HEALTH_CHECK_URL
- HEALTH_CHECK_METHOD

For health checking, simply call a get or a hit endpoint of your selected namespace/key pair. In this way the `HEALTH_CHECK_URL` must include the authentication code and the `HEALTH_CHECK_METHOD` would be `GET`.

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
