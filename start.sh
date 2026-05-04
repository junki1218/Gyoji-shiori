#!/bin/bash
# スクリプトがあるディレクトリに移動
cd "$(dirname "$0")"

# node_modulesがない場合はインストール
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# 開発サーバーを起動し、ブラウザを自動で開く
npm run dev -- --open
