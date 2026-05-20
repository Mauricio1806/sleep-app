# Google Play Store — Checklist de Publicação

## 1. Gerar Keystore de Release

```bash
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore android/app/release.keystore \
  -alias sleepapp \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**IMPORTANTE:** Guarde a keystore e as senhas em local seguro. Perder a keystore = não conseguir atualizar o app.

## 2. Configurar android/app/build.gradle

```gradle
android {
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

## 3. Gerar AAB de Release

```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## 4. Assets Necessários

| Asset | Dimensões | Formato |
|-------|-----------|---------|
| Ícone do app | 512×512 px | PNG, fundo não transparente |
| Feature graphic | 1024×500 px | PNG ou JPG |
| Screenshots telefone | 1080×1920 mín | PNG ou JPG |
| Screenshots tablet 7" | 1200×1920 mín | PNG ou JPG (opcional) |

**Mínimo de screenshots:** 2 por device type

## 5. Permissões no AndroidManifest.xml

```xml
<!-- Sons em background -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />

<!-- Internet para API Claude -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Notificações (Android 13+) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Manter CPU acordada para timer de sons -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

## 6. Configuração de Tracks no Play Console

```
Internal Testing → Closed Testing → Open Testing → Production

Critério para avançar Internal → Closed:
  - 0 crashes em 50 sessões
  - Nota média > 4.0 nos feedbacks internos

Critério para avançar Closed → Open:
  - 50+ beta testers sem crashes críticos
  - Principais flows funcionando (ver BETA_TESTING.md)

Critério para Production:
  - Staged rollout: 10% → 25% → 50% → 100%
```

## 7. Classificação Etária IARC

- Categoria sugerida: **Todos (3+)**
- Violência: Nenhuma
- Conteúdo adulto: Nenhum
- Jogos de azar: Nenhum
- Dados de saúde: **SIM** (declarar no Data Safety)

## 8. Data Safety (obrigatório)

| Dado coletado | Tipo | Compartilhado | Criptografado |
|--------------|------|--------------|--------------|
| Horários de sono | Saúde e Exercício | Não | Sim |
| Qualidade do sono | Saúde e Exercício | Não | Sim |
| ID anônimo do dispositivo | Identificadores | Não | Sim |

**Não coletamos:** nome, email, localização, contatos.

## 9. Descrição da Store (PT-BR)

**Título (30 chars):** SleepApp — Sono com IA

**Descrição curta (80 chars):** Seu plano personalizado de sono gerado por inteligência artificial

**Descrição longa:** Ver arquivo de marketing separado.
