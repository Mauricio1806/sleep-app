#!/bin/bash
set -e

BUCKET_NAME="${1:-sleepapp-sounds-prod}"
LAMBDA_NAME="sleepapp-claude-proxy"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
ROLE_NAME="sleepapp-lambda-role"

echo "==> Criando bucket S3: $BUCKET_NAME"
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  $([ "$REGION" != "us-east-1" ] && echo "--create-bucket-configuration LocationConstraint=$REGION")

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Principal\": \"*\",
    \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/sons/*\"
  }]
}"

echo "==> Criando role IAM: $ROLE_NAME"
aws iam create-role --role-name "$ROLE_NAME" \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }' || echo "Role já existe"

aws iam attach-role-policy --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

echo "==> Aguardando role propagar..."
sleep 10

echo "==> Criando pacote Lambda"
cd infrastructure/lambda/claude-proxy
zip -r function.zip index.js
cd ../../..

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

echo "==> Criando Lambda: $LAMBDA_NAME"
aws lambda create-function \
  --function-name "$LAMBDA_NAME" \
  --runtime nodejs20.x \
  --handler index.handler \
  --role "$ROLE_ARN" \
  --zip-file fileb://infrastructure/lambda/claude-proxy/function.zip \
  --timeout 35 \
  --memory-size 256 \
  --environment Variables="{ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}}" \
  --region "$REGION" || echo "Lambda já existe — atualizando código..."

aws lambda update-function-code \
  --function-name "$LAMBDA_NAME" \
  --zip-file fileb://infrastructure/lambda/claude-proxy/function.zip \
  --region "$REGION" 2>/dev/null || true

echo "==> Criando Function URL"
FUNCTION_URL=$(aws lambda create-function-url-config \
  --function-name "$LAMBDA_NAME" \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["POST","OPTIONS"],"AllowHeaders":["Content-Type"]}' \
  --region "$REGION" \
  --query FunctionUrl \
  --output text 2>/dev/null || \
  aws lambda get-function-url-config \
    --function-name "$LAMBDA_NAME" \
    --region "$REGION" \
    --query FunctionUrl \
    --output text)

aws lambda add-permission \
  --function-name "$LAMBDA_NAME" \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region "$REGION" 2>/dev/null || true

S3_BASE="https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com"

echo ""
echo "========================================"
echo "✅ AWS Setup Completo!"
echo "========================================"
echo "Lambda URL: $FUNCTION_URL"
echo "S3 Base URL: $S3_BASE/sons/"
echo ""
echo "Adicione ao .env:"
echo "AWS_LAMBDA_URL=$FUNCTION_URL"
echo "AWS_S3_BUCKET=$BUCKET_NAME"
echo "AWS_S3_REGION=$REGION"
