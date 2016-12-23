FROM node:7.3

RUN apt-get update \
    && apt-get install -y apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update \
    && apt-get -y install yarn \
    && rm -rf /var/lib/apt/lists/*

RUN yarn global add \
    typescript \
    typings

RUN mkdir /code
WORKDIR /code

ADD . /code
