FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/typescript-node:0-20-bullseye

RUN echo 'if [[ -n $ZSH_INIT_COMMAND_SVRLSSCTR ]]; then\n echo "Running: $ZSH_INIT_COMMAND_SVRLSSCTR"\n eval "$ZSH_INIT_COMMAND_SVRLSSCTR"\n fi' >> /etc/profile

WORKDIR src
RUN npx --yes husky
RUN yarn install
