FROM nikolaik/python-nodejs:latest

USER root

RUN apt-get update && apt-get upgrade -y

WORKDIR /home/pn/app/
COPY . .

#RUN chown -R pn:pn ./node_modules
RUN chown -R pn:pn ./package.json
RUN chown -R pn:pn ./package-lock.json
RUN chmod -R 777 ./
USER pn
WORKDIR /home/pn/app/
RUN npm install
RUN npm rebuild
EXPOSE 5173
ENTRYPOINT ["npm", "run", "host"]





