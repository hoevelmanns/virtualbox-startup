orderboss
=========

ORDERBOSS CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/orderboss.svg)](https://npmjs.org/package/orderboss)
[![Downloads/week](https://img.shields.io/npm/dw/orderboss.svg)](https://npmjs.org/package/orderboss)
[![License](https://img.shields.io/npm/l/orderboss.svg)](https://github.com/hoevelmanns/orderboss-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g orderboss
$ orderboss COMMAND
running command...
$ orderboss (-v|--version|version)
orderboss/0.0.0 linux-x64 node-v12.13.1
$ orderboss --help [COMMAND]
USAGE
  $ orderboss COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`orderboss hello [FILE]`](#orderboss-hello-file)
* [`orderboss help [COMMAND]`](#orderboss-help-command)

## `orderboss hello [FILE]`

describe the command here

```
USAGE
  $ orderboss hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ orderboss hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/hoevelmanns/orderboss-cli/blob/v0.0.0/src/commands/hello.ts)_

## `orderboss help [COMMAND]`

display help for orderboss

```
USAGE
  $ orderboss help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
