# GitHub Actions — Build Release APK

## Por que Linux resolve o problema ARM64

O build local no Windows falha com `couldn't find DSO to load: libgesturehandler.so` porque:

- O NDK no Windows tem limitações de path (MAX_PATH 260 chars) que interrompem a compilação dos `.so` nativos de bibliotecas como `react-native-gesture-handler`
- O resultado é um APK com `.so` ausente ou corrompido para ARM64
- No Linux (ubuntu-latest) não existe esse limite: o NDK compila todos os `.so` normalmente

## Secrets necessários no GitHub

São 3 secrets. Acesse: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor | Como obter |
|--------|-------|-----------|
| `KEYSTORE_BASE64` | Keystore em base64 | Rodar `infrastructure/scripts/encode-keystore.ps1` |
| `KEYSTORE_PASSWORD` | Senha do keystore | Veja `docs/KEYSTORE_INFO.md` |
| `KEY_PASSWORD` | Senha da chave | Mesmo valor que `KEYSTORE_PASSWORD` |

### Gerar o KEYSTORE_BASE64

```powershell
pwsh infrastructure\scripts\encode-keystore.ps1
# Copia o conteúdo de infrastructure/scripts/keystore.b64.txt para o secret
# Apaga o arquivo .b64.txt após configurar
```

## Como baixar o APK gerado

1. Acesse a aba **Actions** no repositório GitHub
2. Clique no workflow **Build Release APK**
3. Clique no run mais recente (verde = sucesso)
4. Na seção **Artifacts**, clique em **app-release**
5. O arquivo `app-release.zip` contém o `app-release.apk`

## Quando o build é disparado

- **Push para `main`**: build automático a cada commit
- **Workflow dispatch**: manual via GitHub Actions → Run workflow

## Diferença entre os workflows

| Workflow | Arquivo | Trigger | Saída | Uso |
|---------|---------|---------|-------|-----|
| Build Release APK | `build-release.yml` | push/main + manual | APK (arm64+armv7) | Beta direto |
| Release | `release.yml` | push tag `v*` | AAB | Play Store |

## Arquiteturas incluídas

O APK do Actions inclui apenas `arm64-v8a` e `armeabi-v7a` — as arquiteturas de dispositivos reais Android. x86/x86_64 (emuladores) são excluídas para reduzir tamanho.
