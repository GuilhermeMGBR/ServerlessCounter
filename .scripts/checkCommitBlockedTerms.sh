#!/bin/bash

# Checks the git diff cache for blocked terms.
#
# To bypass this hook after all other checks are passing, use the "--no-verify"
# parameter when committing.

checkCommitBlockedTerms() {
  # Redirect output to stderr.
  exec 1>&2

  declare -a blockedTerms=(
    "TODO"
    "//"
  )

  changeToScriptDir() { cd $(dirname $0); }
  changeToScriptDir;

  local foundError=false

  for term in "${blockedTerms[@]}"
  do
    if ! ./checkCommitForTerm.sh $term; then
      foundError=true
    fi
  done

  if [ "$foundError" = true ]; then
    exit 1
  fi

  echo  Found no blocked terms
}

checkCommitBlockedTerms;
