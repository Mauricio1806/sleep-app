#!/bin/bash
# Roda como: sudo bash setup-ec2.sh
set -e

echo "🚀 Configurando EC2 para SleepApp Backend..."

# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "✅ Node.js $(node --version) instalado"

# 3. Instalar PM2 globalmente
sudo npm install -g pm2

echo "✅ PM2 instalado"

# 4. Instalar Nginx
sudo apt install -y nginx

# 5. Criar usuário da aplicação (não rodar como root)
id sleepapp &>/dev/null || sudo useradd -m -s /bin/bash sleepapp

# 6. Criar pasta da aplicação e logs
sudo mkdir -p /opt/sleep-app-backend
sudo mkdir -p /var/log/sleep-app
sudo chown sleepapp:sleepapp /opt/sleep-app-backend
sudo chown sleepapp:sleepapp /var/log/sleep-app

# 7. Configurar Nginx como reverse proxy
sudo tee /etc/nginx/sites-available/sleep-app << 'EOF'
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    location /health {
        proxy_pass http://localhost:3000/api/v1/health;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/sleep-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx && sudo systemctl enable nginx

echo "✅ Nginx configurado e rodando"

# 8. Configurar PM2 para iniciar no boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u sleepapp --hp /home/sleepapp

# 9. Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo ""
echo "✅ EC2 configurado com sucesso!"
echo ""
echo "Próximos passos:"
echo "  1. Copie o código: scp -i KEY.pem -r ec2/* ec2-user@EC2_IP:/opt/sleep-app-backend/"
echo "  2. Faça SSH e rode: cd /opt/sleep-app-backend && npm install && cp .env.example .env"
echo "  3. Edite o .env com sua ANTHROPIC_API_KEY"
echo "  4. Inicie: pm2 start ecosystem.config.js --env production && pm2 save"
