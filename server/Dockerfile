FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY server/package*.json ./
RUN npm install --legacy-peer-deps



# Install global dependencies (ts-node and nodemon)
RUN npm install -g typescript nodemon ts-node

# Copy the server source code into the container
COPY ./server /usr/src/app/server
COPY ./shared /usr/src/app/shared

WORKDIR /usr/src/app/server

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
