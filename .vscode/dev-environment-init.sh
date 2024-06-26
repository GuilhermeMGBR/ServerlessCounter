#!/bin/bash

secretsPath="../.secrets"

foundSecretsFile() {
  [ -f $secretsPath ]
}
enableExport() { set -a; }
disableExport() { set +a; }

if foundSecretsFile; then
  enableExport;
  source $secretsPath
  disableExport;

  echo Loaded .secrets
fi

alias y=yarn
echo Setting \'y\' as \'yarn\' alias
