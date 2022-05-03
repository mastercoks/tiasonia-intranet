#!/usr/bin/env bashnknlknlk
DOMAIN=${DOMAIN-localhost}

echo "building intranet"
docker-compose -f intranet.yml build
echo "publishing intranet"
docker-compose -f intranet.yml push
echo "deploying traefik stack in http mode"
docker stack deploy -c intranet.yml intranet
echo "Certificates is available at:"
echo "- http://${DOMAIN}"
