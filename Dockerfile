# base image
FROM node:9.6.1

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn

# copy app
COPY . .

# start app
CMD ["yarn", "start"]