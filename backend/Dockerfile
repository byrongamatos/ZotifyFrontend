FROM nikolaik/python-nodejs:latest

USER root

RUN chmod -R 777 /media
RUN usermod -a -G users pn
RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y ffmpeg sqlite3

WORKDIR /root/.config/zotify/
COPY config.json .
WORKDIR /root/app/
COPY . .

WORKDIR /root/app/

ENV PATH="${PATH}:/root/.local/bin"
RUN python -m pip install git+https://zotify.xyz/zotify/zotify.git

RUN chown -R root:root ./package.json
RUN chown -R root:root ./package-lock.json
RUN chmod -R 777 ./
WORKDIR /root/app/
RUN npm install
RUN npm rebuild
CMD ["node", "server.js"]

EXPOSE 1337


