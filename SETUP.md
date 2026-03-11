# セットアップ手順

## 1. コンテナのビルドと起動

```bash
docker compose up --build -d
```

## 2. コンテナに接続

```bash
docker compose exec claude bash
```

## 3. Claude CLI の起動

```bash
claude
claude --dangerously-skip-permissions
claude --enable-auto-mode
```
