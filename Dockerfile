FROM mhart/alpine-node
MAINTAINER mlabouardy <mohamed@labouardy.com>

ENV REFRESH_TIME 10

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# Bundle app source
COPY . /src

# Expose Port

EXPOSE 3000
CMD ["node","/src/server.js"]
