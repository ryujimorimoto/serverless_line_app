# 森本メモ

webhook の処理は、koa-router, @shopify/koa-shopify-webhooks, @shopify/koa-shopify-auth を使う。
curl -X POST -H "Content-Type: application/json" -H "X-Shopify-Access-Token: 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" https://xn-eeuway0cad4fuavbe0ora14a.myshopify.com/admin/api/2021-01/webhooks.json -d "$(cat <<EOS
{
"webhook": {
"topic": "products/update",
"address": "arn:aws:events:ap-northeast-1::event-source/aws.partner/shopify.com/4795293/LineEventBridge",
"format": "json"
}
}
EOS
)" | jq .

- LINE BOT は、"/dev/api/line/{+proxy}" の URL で動作する。
- この +proxy を任意に設定して、動作する lambda を変更したい。

# Serverless API

- Amplify の api / function は拡張性が弱いため利用せず、Serverless Framework でバックエンド API を構築

## 環境構築

- [Serverless Framework](https://www.serverless.com/framework/docs/)をインストール

## API のビルド＆デプロイ

- yarn install
- serverless deploy

## Cognito 認証

- 以下をベースに実装
  　- https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
  　- https://github.com/serverless/examples/blob/master/aws-node-auth0-cognito-custom-authorizers-api/auth.js
  　- https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.ts

### authorizer を使う全ての HTTP エンドポイントにおいて TTL のキャッシュを無効(0)にする

- resultTtlInSeconds: 0
  　- オーソライザーのキャッシュが有効だと、複数の HTTP イベントからオーソライザーが呼び出された際に HTTP イベントが異なっても以前の HTTP イベントのキャッシュが参照されてしまう。
  　- GET -> POST とリクエストすると GET だと認識してしまうのでオーソライザーのキャッシュを無効にして対応する。
  　- [公式の解説](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers)

## .env

- SHOPIFY_API_KEY
  　- Shopify パートナーダッシュボードから取得
- SHOPIFY_API_SECRET
  　- Shopify パートナーダッシュボードから取得
- COGNITO_USER_POOL
  　- Cognito コンソールから ID を取得
- REGION
  　- リージョンを指定
- PUBLIC_API_URL=/api/public
- PRIVATE_API_URL=/api/private
