# !/bin/sh

# Checks the git diff cache for the provided term.

checkCommitForTerm() {
  # Redirect output to stderr.
  exec 1>&2
  
  getGitCache() { git diff --cached ':(exclude)../yarn.lock' ':(exclude)yarn.lock'; }
  filterAdditions() { grep '^+' $1; }
  ignoreFilenames() { grep -v '+++ b/' $1; }
  ignoreFirstChar() { cut -c 2- $1; }
  findBlockedTerm() { grep -i $1 $2; }
  printError() {
    # Define colors
    local RED='\033[0;31m'
    local NO_COLOR='\033[0m'

    printf "${RED}error:${NO_COLOR} ${1}"
  }
  
  local FOUND_TERM=$(getGitCache | filterAdditions | ignoreFilenames | ignoreFirstChar | findBlockedTerm $1)

  if [[ $FOUND_TERM ]]; then
    printError "Found '${1}' in attempted commit.\n"
    printError "Please remove all occurrences of '${1}' before committing.\n\n"
    exit 1
  fi
}

checkCommitForTerm $1;
