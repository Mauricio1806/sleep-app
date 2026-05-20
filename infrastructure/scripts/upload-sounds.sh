#!/bin/bash
set -e

BUCKET_NAME="${1:-sleepapp-sounds-prod}"
SOUNDS_DIR="${2:-./assets/sounds}"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"

SOUND_FILES=(
  "chuva.mp3"
  "ruido-branco.mp3"
  "floresta.mp3"
  "oceano.mp3"
  "trovao.mp3"
  "cafe.mp3"
  "lareira.mp3"
  "batimentos.mp3"
)

echo "==> Upload de sons para s3://$BUCKET_NAME/sons/"
echo ""

for file in "${SOUND_FILES[@]}"; do
  local_path="$SOUNDS_DIR/$file"
  if [ -f "$local_path" ]; then
    aws s3 cp "$local_path" "s3://$BUCKET_NAME/sons/$file" \
      --content-type "audio/mpeg" \
      --cache-control "public, max-age=31536000" \
      --region "$REGION"
    echo "✅ https://$BUCKET_NAME.s3.$REGION.amazonaws.com/sons/$file"
  else
    echo "⚠️  Arquivo não encontrado: $local_path"
  fi
done

echo ""
echo "========================================"
echo "URLs públicas dos sons:"
echo "========================================"
for file in "${SOUND_FILES[@]}"; do
  echo "https://$BUCKET_NAME.s3.$REGION.amazonaws.com/sons/$file"
done
