#!/bin/bash

echo "Stopping all running containers..."
docker ps -q | xargs --no-run-if-empty docker stop

echo "Removing all containers..."
docker ps -aq | xargs --no-run-if-empty docker rm -f

echo "Removing all images..."
docker images -aq | xargs --no-run-if-empty docker rmi -f

echo "Removing all custom networks..."
docker network ls | grep -v "bridge\|host\|none" | awk '/ / { print $1 }' | xargs --no-run-if-empty docker network rm

echo "Removing all volumes..."
docker volume ls -q | xargs --no-run-if-empty docker volume rm

echo "Comprehensive cleanup..."
docker system prune -a --volumes -f

echo "Docker cleanup completed successfully."
