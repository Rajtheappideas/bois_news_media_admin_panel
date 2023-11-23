FROM node:18

## Copy source code
COPY . .

RUN npm install -g serve

## Start the application
CMD ["serve", "-s", "build"]