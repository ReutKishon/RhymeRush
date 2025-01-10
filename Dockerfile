FROM node:21

# Set the working directory in the container
# create app directories
RUN mkdir -p /app/server /app/shared


RUN npm i -g pnpm

# Copy package.json and install dependencies
COPY server/package*.json /app/server
COPY shared/package*.json /app/shared

WORKDIR /app/server
RUN pnpm install
WORKDIR /app/shared
RUN pnpm install

# Copy the server source code into the container
COPY ./server /app/server
COPY ./shared /app/shared

WORKDIR /app/server

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
