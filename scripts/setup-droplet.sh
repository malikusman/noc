#!/bin/bash
# Run once on the DigitalOcean droplet as root:
#   curl -fsSL https://raw.githubusercontent.com/malikusman/noc/main/scripts/setup-droplet.sh | bash
set -e

echo "=== Installing Docker ==="
apt-get update -y
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable docker
systemctl start docker

echo "=== Cloning repo ==="
mkdir -p /opt/noc
git clone https://github.com/malikusman/noc.git /opt/noc || (cd /opt/noc && git pull)

echo "=== Starting app ==="
cd /opt/noc
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "=== Done! App is running at http://$(curl -s ifconfig.me) ==="
