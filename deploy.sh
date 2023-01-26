#!/usr/bin/env bash
DOMAIN=${DOMAIN-localhost}

echo "load environment variables from .env file in bash"
set -a
source .env
set +a

echo "building intranet"
docker-compose -f intranet.yml build
echo "publishing intranet"
docker-compose -f intranet.yml push
echo "deploying traefik stack in http mode"
docker stack deploy -c intranet.yml intranet
echo "Intranet is available at:"
echo "- http://${DOMAIN}"
