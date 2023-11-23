FROM node:18

ENV NODE_ENV production

## Copy source code
COPY . .

RUN npm install -g serve

## Start the application
CMD ["serve", "-s", "build"]