#!/bin/bash
# Uso: bash deploy-ec2.sh EC2_IP EC2_KEY.pem
set -e

EC2_IP=$1
KEY_FILE=$2

if [ -z "$EC2_IP" ] || [ -z "$KEY_FILE" ]; then
  echo "Uso: bash deploy-ec2.sh <EC2_IP> <KEY_FILE.pem>"
  exit 1
fi

REMOTE_DIR="/opt/sleep-app-backend"
EC2_USER="ubuntu"

echo "📦 Enviando código para EC2 ($EC2_IP)..."

scp -i "$KEY_FILE" -r \
  ../ec2/server.js \
  ../ec2/package.json \
  ../ec2/ecosystem.config.js \
  ../ec2/routes \
  ../ec2/services \
  ../ec2/middleware \
  "$EC2_USER@$EC2_IP:$REMOTE_DIR/"

if [ ! -f "../ec2/.env" ]; then
  echo "⚠️  Arquivo .env não encontrado. Copiando .env.example..."
  scp -i "$KEY_FILE" ../ec2/.env.example "$EC2_USER@$EC2_IP:$REMOTE_DIR/.env.example"
fi

echo "🚀 Instalando dependências e reiniciando serviço..."

ssh -i "$KEY_FILE" "$EC2_USER@$EC2_IP" << 'REMOTE'
  set -e
  cd /opt/sleep-app-backend

  npm install --production --silent

  if pm2 describe sleep-app-backend > /dev/null 2>&1; then
    pm2 reload sleep-app-backend --update-env
  else
    pm2 start ecosystem.config.js --env production
  fi

  pm2 save
  echo "✅ Deploy concluído em $(date)"
  echo "Status:"
  pm2 status sleep-app-backend
REMOTE

echo ""
echo "✅ Deploy finalizado!"
echo "   Health check: curl http://$EC2_IP/health"
