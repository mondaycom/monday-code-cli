monday-apps-cli
=================

monday.com cli tool for monday apps management.

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @mondaycom/apps-cli
$ mapps COMMAND
running command...
$ mapps (--version)
@mondaycom/apps-cli/4.3.0 darwin-arm64 node-v18.19.0
$ mapps --help [COMMAND]
USAGE
  $ mapps COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`mapps api:generate`](#mapps-apigenerate)
* [`mapps app-features:build`](#mapps-app-featuresbuild)
* [`mapps app-features:create`](#mapps-app-featurescreate)
* [`mapps app-features:list`](#mapps-app-featureslist)
* [`mapps app-version:builds`](#mapps-app-versionbuilds)
* [`mapps app-version:list`](#mapps-app-versionlist)
* [`mapps app:create`](#mapps-appcreate)
* [`mapps app:deploy`](#mapps-appdeploy)
* [`mapps app:list`](#mapps-applist)
* [`mapps autocomplete [SHELL]`](#mapps-autocomplete-shell)
* [`mapps code:env`](#mapps-codeenv)
* [`mapps code:logs`](#mapps-codelogs)
* [`mapps code:push`](#mapps-codepush)
* [`mapps code:secret`](#mapps-codesecret)
* [`mapps code:status`](#mapps-codestatus)
* [`mapps help [COMMANDS]`](#mapps-help-commands)
* [`mapps init`](#mapps-init)
* [`mapps storage:export`](#mapps-storageexport)
* [`mapps storage:search`](#mapps-storagesearch)
* [`mapps tunnel:create`](#mapps-tunnelcreate)

## `mapps api:generate`

Prepares your environment for custom queries development. run it from your root directory!

```
USAGE
  $ mapps api:generate

DESCRIPTION
  Prepares your environment for custom queries development. run it from your root directory!
  Creates all necessary files and scripts
  to start working with custom api queries and mutations.
  Read the documentation at
  [@mondaydotcomorg/setup-api](https://github.com/mondaycom/monday-graphql-api/tree/main/packages/setup-api)
```

_See code: [src/commands/api/generate.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/api/generate.ts)_

## `mapps app-features:build`

Create an app feature build.

```
USAGE
  $ mapps app-features:build [--verbose] [--print-command] [-a <value>] [-i <value>] [-d <value>] [-t
    custom_url|monday_code|monday_code_cdn] [-u <value>]

FLAGS
  -a, --appId=<value>         Please enter app id:
  -d, --appFeatureId=<value>  Please enter the app feature id of your app:
  -i, --appVersionId=<value>  Please enter the app version id of your app:
  -t, --buildType=<option>    Build type
                              <options: custom_url|monday_code|monday_code_cdn>
  -u, --customUrl=<value>     Custom url

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Create an app feature build.

EXAMPLES
  $ mapps app-features:build -a APP_ID -i APP_VERSION_ID -d APP_FEATURE_ID  -t BUILD_TYPE -u CUSTOM_URL
```

_See code: [src/commands/app-features/build.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app-features/build.ts)_

## `mapps app-features:create`

Create an app feature.

```
USAGE
  $ mapps app-features:create [--verbose] [--print-command] [-a <value>] [-i <value>] [-t <value>] [-n <value>]

FLAGS
  -a, --appId=<value>         Please enter app id:
  -i, --appVersionId=<value>  Please enter the app version id of your app:
  -n, --featureName=<value>   Feature name
  -t, --featureType=<value>   Feature type

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Create an app feature.

EXAMPLES
  $ mapps app-features:create -a APP_ID -i APP_VERSION_ID -t APP-FEATURE-TYPE
```

_See code: [src/commands/app-features/create.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app-features/create.ts)_

## `mapps app-features:list`

List all features for a specific app version.

```
USAGE
  $ mapps app-features:list [--verbose] [--print-command] [-a <value>] [-i <value>]

FLAGS
  -a, --appId=<value>         Please enter app id:
  -i, --appVersionId=<value>  Please enter the app version id of your app:

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  List all features for a specific app version.

EXAMPLES
  $ mapps app-features:list -a APP_ID -i APP_VERSION_ID
```

_See code: [src/commands/app-features/list.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app-features/list.ts)_

## `mapps app-version:builds`

List all builds for a specific app version

```
USAGE
  $ mapps app-version:builds [--verbose] [--print-command] [-i <value>]

FLAGS
  -i, --appVersionId=<value>  Please enter the app version id of your app:

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  List all builds for a specific app version

EXAMPLES
  $ mapps app-version:builds -i APP_VERSION_ID
```

_See code: [src/commands/app-version/builds.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app-version/builds.ts)_

## `mapps app-version:list`

List all versions for a specific app.

```
USAGE
  $ mapps app-version:list [--verbose] [--print-command] [-i <value>]

FLAGS
  -i, --appId=<value>  Please enter app id:

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  List all versions for a specific app.

EXAMPLES
  $ mapps app-version:list
```

_See code: [src/commands/app-version/list.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app-version/list.ts)_

## `mapps app:create`

Create an app.

```
USAGE
  $ mapps app:create [--verbose] [--print-command] [-n <value>] [-d <value>]

FLAGS
  -d, --targetDir=<value>  Directory to create the app in.
  -n, --name=<value>       Name your new app.

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Create an app.

EXAMPLES
  $ mapps app:create

  $ mapps app:create -n NEW_APP_NAME
```

_See code: [src/commands/app/create.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app/create.ts)_

## `mapps app:deploy`

Deploy an app using manifest file.

```
USAGE
  $ mapps app:deploy [--verbose] [--print-command] [-d <value>] [-a <value>] [-v <value>] [-f] [-z us|eu|au]

FLAGS
  -a, --appId=<value>          App id (will use the latest draft version)
  -d, --directoryPath=<value>  Directory path of you project in your machine. If not included will use the current
                               working directory.
  -f, --force                  Force push to latest version (draft or live)
  -v, --appVersionId=<value>   App version id
  -z, --region=<option>        Region to use
                               <options: us|eu|au>

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Deploy an app using manifest file.

EXAMPLES
  $ mapps app:deploy
```

_See code: [src/commands/app/deploy.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app/deploy.ts)_

## `mapps app:list`

List all apps for a specific user.

```
USAGE
  $ mapps app:list [--verbose] [--print-command]

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  List all apps for a specific user.

EXAMPLES
  $ mapps app:list
```

_See code: [src/commands/app/list.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/app/list.ts)_

## `mapps autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ mapps autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ mapps autocomplete

  $ mapps autocomplete bash

  $ mapps autocomplete zsh

  $ mapps autocomplete powershell

  $ mapps autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.0.5/src/commands/autocomplete/index.ts)_

## `mapps code:env`

Manage environment variables for your app hosted on monday-code.

```
USAGE
  $ mapps code:env [--verbose] [--print-command] [-i <value>] [-m list-keys|set|delete] [-k <value>] [-v
    <value>] [-z us|eu|au]

FLAGS
  -i, --appId=<value>    The id of the app to manage environment variables for
  -k, --key=<value>      variable key [required for set and delete]]
  -m, --mode=<option>    management mode
                         <options: list-keys|set|delete>
  -v, --value=<value>    variable value [required for set]
  -z, --region=<option>  Region to use
                         <options: us|eu|au>

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Manage environment variables for your app hosted on monday-code.

EXAMPLES
  $ mapps code:env
```

_See code: [src/commands/code/env.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/code/env.ts)_

## `mapps code:logs`

Stream logs

```
USAGE
  $ mapps code:logs [--verbose] [--print-command] [-i <value>] [-t <value>] [-s <value>] [-f <value>] [-e
    <value>] [-r <value>] [-z us|eu|au]

FLAGS
  -e, --logsEndDate=<value>        End date (MM/DD/YYYY HH:mm) e.g. "03/25/1983 16:45" [supported only if
                                   eventSource=live]
  -f, --logsStartDate=<value>      Start date (MM/DD/YYYY HH:mm) e.g. "03/24/1983 15:45" [supported only if
                                   eventSource=live]
  -i, --appVersionId=<value>       Please enter the app version id of your app:
  -r, --logSearchFromText=<value>  text: a text in regex that will be searched among the logs text [supported only if
                                   eventSource=live]
  -s, --eventSource=<value>        Source: "live" for live events, "History" for fetching events from the past
  -t, --logsType=<value>           Logs type: "http" for http events, "console" for stdout
  -z, --region=<option>            Region to use
                                   <options: us|eu|au>

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Stream logs

EXAMPLES
  $ mapps code:logs -i APP_VERSION_ID -t LOGS_TYPE
```

_See code: [src/commands/code/logs.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/code/logs.ts)_

## `mapps code:push`

Push your project to get hosted on monday-code.

```
USAGE
  $ mapps code:push [--verbose] [--print-command] [-d <value>] [-a <value>] [-i <value>] [-f] [-z us|eu|au]

FLAGS
  -a, --appId=<value>          Please enter app id:
  -d, --directoryPath=<value>  Directory path of you project in your machine. If not included will use the current
                               working directory.
  -f, --force                  Force push to live version
  -i, --appVersionId=<value>   Please enter the app version id of your app:
  -z, --region=<option>        Region to use
                               <options: us|eu|au>

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Push your project to get hosted on monday-code.

EXAMPLES
  $ mapps code:push -d PROJECT DIRECTORY PATH -i APP_VERSION_ID_TO_PUSH

  $ mapps code:push -i APP_VERSION_ID_TO_PUSH

  $ mapps code:push -a APP_ID_TO_PUSH
```

_See code: [src/commands/code/push.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/code/push.ts)_

## `mapps code:secret`

Manage secret variables for your app hosted on monday-code.

```
USAGE
  $ mapps code:secret [--verbose] [--print-command] [-i <value>] [-m list-keys|set|delete] [-k <value>] [-v
    <value>] [-z us|eu|au]

FLAGS
  -i, --appId=<value>    The id of the app to manage secret variables for
  -k, --key=<value>      variable key [required for set and delete]]
  -m, --mode=<option>    management mode
                         <options: list-keys|set|delete>
  -v, --value=<value>    variable value [required for set]
  -z, --region=<option>  Region to use
                         <options: us|eu|au>

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Manage secret variables for your app hosted on monday-code.

EXAMPLES
  $ mapps code:secret
```

_See code: [src/commands/code/secret.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/code/secret.ts)_

## `mapps code:status`

Status of a specific project hosted on monday-code.

```
USAGE
  $ mapps code:status [--verbose] [--print-command] [-i <value>] [-z us|eu|au]

FLAGS
  -i, --appVersionId=<value>  Please enter the app version id of your app:
  -z, --region=<option>       Region to use
                              <options: us|eu|au>

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Status of a specific project hosted on monday-code.

EXAMPLES
  $ mapps code:status -i APP_VERSION_ID
```

_See code: [src/commands/code/status.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/code/status.ts)_

## `mapps help [COMMANDS]`

Display help for mapps.

```
USAGE
  $ mapps help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mapps.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

## `mapps init`

Initialize mapps config file - ".mappsrc".

```
USAGE
  $ mapps init [--verbose] [--print-command] [-t <value>] [-l]

FLAGS
  -l, --local          create the configuration file locally, in the current project working directory
  -t, --token=<value>  monday.com api access token (https://developer.monday.com/api-reference/docs/authentication)

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Initialize mapps config file - ".mappsrc".

EXAMPLES
  $ mapps init -t SECRET_TOKEN
```

_See code: [src/commands/init/index.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/init/index.ts)_

## `mapps storage:export`

Export all keys and values stored on monday for a specific customer account.

```
USAGE
  $ mapps storage:export [--verbose] [--print-command] [-a <value>] [-c <value>] [-f <value>] [-d <value>]

FLAGS
  -a, --appId=<value>            Select the app that you wish to retrieve the key for
  -c, --clientAccountId=<value>  Client account number.
  -d, --fileDirectory=<value>    Optional, file path.
  -f, --fileFormat=<value>       Optional, file format "CSV" or "JSON" (the default value is "JSON").

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Export all keys and values stored on monday for a specific customer account.

EXAMPLES
  $ mapps storage:export -a APP_ID -c CLIENT_ACCOUNT_ID -d FILE_FULL_PATH -f FILE_FORMAT
```

_See code: [src/commands/storage/export.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/storage/export.ts)_

## `mapps storage:search`

Search keys and values stored on monday for a specific customer account.

```
USAGE
  $ mapps storage:search [--verbose] [--print-command] [-a <value>] [-c <value>] [-t <value>]

FLAGS
  -a, --appId=<value>            Select the app that you wish to retrieve the key for
  -c, --clientAccountId=<value>  Client account number.
  -t, --term=<value>             Term to search for.

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Search keys and values stored on monday for a specific customer account.

EXAMPLES
  $ mapps storage:search -a APP_ID -c CLIENT_ACCOUNT_ID -t TERM
```

_See code: [src/commands/storage/search.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/storage/search.ts)_

## `mapps tunnel:create`

Create a networking tunnel to publicly expose code running on the local machine.

```
USAGE
  $ mapps tunnel:create [--verbose] [--print-command] [-p <value>] [-a <value>]

FLAGS
  -a, --appId=<value>  Specify an app id to get a unique tunnel domain for this app.
  -p, --port=<value>   [default: 8080] Port to forward tunnel traffic to.

GLOBAL FLAGS
  --print-command  Print the command that was executed (optional).
  --verbose        Print advanced logs (optional).

DESCRIPTION
  Create a networking tunnel to publicly expose code running on the local machine.

EXAMPLES
  $ mapps tunnel:create

  $ mapps tunnel:create -p PORT_FOR_TUNNEL

  $ mapps tunnel:create -a APP_ID_FOR_TUNNEL

  $ mapps tunnel:create -p PORT_FOR_TUNNEL -a APP_ID_FOR_TUNNEL
```

_See code: [src/commands/tunnel/create.ts](https://github.com/mondaycom/monday-apps-cli/blob/v4.3.0/src/commands/tunnel/create.ts)_
<!-- commandsstop -->
