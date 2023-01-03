FROM node:16.16.0

# create bot's directory 
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# copy and install bot
COPY package.json /usr/src/bot
RUN npm i
COPY . /usr/src/bot

# run bot
CMD ["node", "index.js"]
