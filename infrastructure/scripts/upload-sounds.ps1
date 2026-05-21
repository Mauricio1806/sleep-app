# Upload sleep sounds to S3
# Run: .\upload-sounds.ps1 -SoundsFolder "C:\Users\mauri\Downloads\sons-sleep-app"

param(
    [Parameter(Mandatory = $true)]
    [string]$SoundsFolder
)

$BucketName = "sleep-app-audios-mauricio"
$Region = "us-east-1"
$BaseUrl = "https://$BucketName.s3.$Region.amazonaws.com/sons"

$RequiredFiles = @(
    @{ file = "chuva-suave.mp3"; name = "Chuva Suave" },
    @{ file = "ruido-branco.mp3"; name = "Ruído Branco" },
    @{ file = "floresta-noite.mp3"; name = "Floresta à Noite" },
    @{ file = "ondas-mar.mp3"; name = "Ondas do Mar" },
    @{ file = "vento-suave.mp3"; name = "Vento Suave" },
    @{ file = "rio-montanha.mp3"; name = "Rio da Montanha" },
    @{ file = "trovao.mp3"; name = "Trovão" },
    @{ file = "lareira.mp3"; name = "Lareira" },
    @{ file = "cafe-parisiense.mp3"; name = "Café Parisiense" },
    @{ file = "batimentos.mp3"; name = "Batimentos Cardíacos" },
    @{ file = "chuva-janela.mp3"; name = "Chuva na Janela" },
    @{ file = "floresta-tropical.mp3"; name = "Floresta Tropical" },
    @{ file = "baleia-humpback.mp3"; name = "Baleia Humpback" },
    @{ file = "trem-noturno.mp3"; name = "Trem Noturno" },
    @{ file = "ventilador.mp3"; name = "Ventilador" },
    @{ file = "passaros.mp3"; name = "Pássaros" }
)

Write-Host "🎵 Upload de sons para SleepApp S3" -ForegroundColor Cyan
Write-Host "Pasta: $SoundsFolder`n"

# 1. Validar que todos os arquivos existem
$missing = @()
foreach ($s in $RequiredFiles) {
    $path = Join-Path $SoundsFolder $s.file
    if (-not (Test-Path $path)) { $missing += $s.file }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ Arquivos faltando ($($missing.Count)/$($RequiredFiles.Count)):" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host "`nAdicione os arquivos faltando e rode novamente." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Todos os $($RequiredFiles.Count) arquivos encontrados`n" -ForegroundColor Green

# 2. Upload + teste por arquivo
$results = @()
foreach ($s in $RequiredFiles) {
    $localPath = Join-Path $SoundsFolder $s.file
    $s3Key = "sons/$($s.file)"
    $url = "$BaseUrl/$($s.file)"

    Write-Host "⬆️  Enviando $($s.name)..." -NoNewline

    aws s3 cp $localPath "s3://$BucketName/$s3Key" `
        --content-type "audio/mpeg" `
        --cache-control "public, max-age=31536000" `
        --region $Region --quiet

    if ($LASTEXITCODE -ne 0) {
        Write-Host " ❌ Falha no upload" -ForegroundColor Red
        $results += [PSCustomObject]@{ Name = $s.name; File = $s.file; Status = "❌ Upload falhou"; URL = $url }
        continue
    }

    try {
        $r = Invoke-WebRequest -Uri $url -Method HEAD -TimeoutSec 10 -ErrorAction Stop
        Write-Host " ✅ OK ($($r.StatusCode))" -ForegroundColor Green
        $results += [PSCustomObject]@{ Name = $s.name; File = $s.file; Status = "✅ Online"; URL = $url }
    } catch {
        Write-Host " ⚠️  Upload ok mas URL não acessível ainda" -ForegroundColor Yellow
        $results += [PSCustomObject]@{ Name = $s.name; File = $s.file; Status = "⚠️  Verificar"; URL = $url }
    }
}

# 3. Tabela de status
Write-Host "`n📊 Resultado:" -ForegroundColor Cyan
$results | Format-Table Name, Status, File -AutoSize

$ok = ($results | Where-Object { $_.Status -like "*✅*" }).Count
Write-Host "✅ $ok/$($RequiredFiles.Count) sons disponíveis online" -ForegroundColor Green
Write-Host "Base URL: $BaseUrl/" -ForegroundColor White
