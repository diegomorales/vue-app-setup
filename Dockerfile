FROM node:8.11

RUN mkdir -p /home/node/code

USER node

WORKDIR /home/node/code

RUN echo 'alias ll="ls -la"' >> /home/node/.bashrc
RUN echo 'npm start' >> /home/node/.bash_history
