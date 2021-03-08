FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

RUN ["chmod", "+x", "run.sh"]
CMD ["sh", "run.sh"]
