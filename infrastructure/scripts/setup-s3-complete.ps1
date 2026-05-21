# Setup S3 bucket for SleepApp audio files
# Run: .\setup-s3-complete.ps1

$BucketName = "sleep-app-audios-mauricio"
$Region = "us-east-1"

Write-Host "🪣 Configurando bucket S3: $BucketName" -ForegroundColor Cyan

# 1. Verificar autenticação AWS
Write-Host "`n[1/6] Verificando autenticação AWS..." -ForegroundColor Yellow
$identity = aws sts get-caller-identity --output json 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "AWS CLI não autenticado. Execute: aws configure"
    exit 1
}
$account = ($identity | ConvertFrom-Json).Account
Write-Host "✅ Conta AWS: $account" -ForegroundColor Green

# 2. Criar bucket
Write-Host "`n[2/6] Criando bucket..." -ForegroundColor Yellow
$existing = aws s3api head-bucket --bucket $BucketName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Bucket já existe" -ForegroundColor Green
} else {
    aws s3api create-bucket --bucket $BucketName --region $Region
    Write-Host "✅ Bucket criado" -ForegroundColor Green
}

# 3. Remover bloqueio público
Write-Host "`n[3/6] Removendo bloqueio público..." -ForegroundColor Yellow
aws s3api delete-public-access-block --bucket $BucketName
Write-Host "✅ Bloqueio público removido" -ForegroundColor Green

# 4. Aplicar bucket policy pública para GET
Write-Host "`n[4/6] Aplicando bucket policy..." -ForegroundColor Yellow
$policy = @{
    Version   = "2012-10-17"
    Statement = @(
        @{
            Sid       = "PublicReadGetObject"
            Effect    = "Allow"
            Principal = "*"
            Action    = "s3:GetObject"
            Resource  = "arn:aws:s3:::$BucketName/*"
        }
    )
} | ConvertTo-Json -Depth 5

aws s3api put-bucket-policy --bucket $BucketName --policy $policy
Write-Host "✅ Bucket policy aplicada" -ForegroundColor Green

# 5. Configurar CORS
Write-Host "`n[5/6] Configurando CORS..." -ForegroundColor Yellow
$cors = @{
    CORSRules = @(
        @{
            AllowedHeaders = @("*")
            AllowedMethods = @("GET", "HEAD")
            AllowedOrigins = @("*")
            ExposeHeaders  = @("ETag", "Content-Length", "Content-Type")
            MaxAgeSeconds  = 3000
        }
    )
} | ConvertTo-Json -Depth 5

aws s3api put-bucket-cors --bucket $BucketName --cors-configuration $cors
Write-Host "✅ CORS configurado" -ForegroundColor Green

# 6. Imprimir URLs base dos 16 sons
Write-Host "`n[6/6] URLs dos sons:" -ForegroundColor Yellow
$BaseUrl = "https://$BucketName.s3.$Region.amazonaws.com/sons"
$sounds = @(
    "chuva-suave", "ruido-branco", "floresta-noite", "ondas-mar", "vento-suave", "rio-montanha",
    "trovao", "lareira", "cafe-parisiense", "batimentos", "chuva-janela",
    "floresta-tropical", "baleia-humpback", "trem-noturno", "ventilador", "passaros"
)
foreach ($s in $sounds) {
    Write-Host "  $BaseUrl/$s.mp3" -ForegroundColor White
}

Write-Host "`n✅ S3 configurado! Próximo passo: .\upload-sounds.ps1 -SoundsFolder 'C:\caminho\para\sons'" -ForegroundColor Green
