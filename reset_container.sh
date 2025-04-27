#!/bin/bash

# 実行フロー
# 1. 起動中のコンテナを停止し削除する
# 2. ボリュームを削除
# 3. イメージを削除
# 4. 新しいイメージをビルド
# 5. コンテナを起動

# メインロジック

docker-compose down
docker volume rm $(docker volume ls -q)
docker rmi $(docker images -q)
docker-compose up -d