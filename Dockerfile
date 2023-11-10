# This Dockerfile is used to build a Thor solo node image based on vechain/thor:v2.1.0
# The initial database directory is copied to the container
# Thor solo then sets up the database with the specified --data-dir in the docker-compose.yml file
FROM vechain/thor:v2.1.0

# Delete /data/thor directory
RUN rm -rf /data/thor

# Copy the initial database directory to the container
COPY ./thor-solo /data/thor
