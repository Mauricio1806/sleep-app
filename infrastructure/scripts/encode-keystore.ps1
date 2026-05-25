$keystorePath = Join-Path $PSScriptRoot "..\..\android\app\sona-release.keystore"
$outputPath   = Join-Path $PSScriptRoot "keystore.b64.txt"

if (-not (Test-Path $keystorePath)) {
    Write-Error "Keystore não encontrada em: $keystorePath"
    exit 1
}

$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $keystorePath).Path)
$b64   = [System.Convert]::ToBase64String($bytes)
$b64 | Out-File -FilePath $outputPath -Encoding utf8 -NoNewline

Write-Host "Base64 gerado em: $outputPath"
Write-Host ""
Write-Host "Próximos passos:"
Write-Host "  1. Abra $outputPath e copie o conteúdo completo"
Write-Host "  2. GitHub → Settings → Secrets → Actions → New secret"
Write-Host "     Nome: KEYSTORE_BASE64    Valor: conteúdo copiado"
Write-Host "     Nome: KEYSTORE_PASSWORD  Valor: HnzADq2RSrXak&MsWpHXmhCj"
Write-Host "     Nome: KEY_PASSWORD       Valor: HnzADq2RSrXak&MsWpHXmhCj"
Write-Host ""
Write-Host "⚠  Apague keystore.b64.txt após configurar os secrets."
