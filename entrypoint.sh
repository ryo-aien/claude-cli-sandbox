#!/bin/bash
set -e

# .envファイルが存在する場合、パーミッションを除去
if [ -f /workspace/.env ]; then
    chmod 000 /workspace/.env
fi

# 一般ユーザーに切り替えてコマンドを実行
exec gosu dev "$@"
