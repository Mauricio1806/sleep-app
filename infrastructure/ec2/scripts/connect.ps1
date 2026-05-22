$EC2_IP = "13.220.143.229"
$KEY_FILE = "C:\Users\mauri\Videos\data-engineering-workspace\sleep-app-key.pem"

# Corrigir permissões do .pem no Windows
icacls $KEY_FILE /inheritance:r
icacls $KEY_FILE /grant:r "${env:USERNAME}:(R)"

# Conectar
ssh -i $KEY_FILE ubuntu@$EC2_IP
