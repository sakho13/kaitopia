#!/bin/bash

# 実行フロー
# 1. 起動中のコンテナを停止し削除する
# 2. ボリュームを削除
# 3. 新しいイメージをビルド
# 4. コンテナを起動

# メインロジック

docker-compose down
docker volume rm $(docker volume ls -q)
docker-compose --env-file ./.env.local up -d
