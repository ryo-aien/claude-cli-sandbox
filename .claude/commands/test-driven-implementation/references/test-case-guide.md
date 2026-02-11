# テストケース選定ガイド

開発対象に応じて以下のテストケースを選定する。

## バックエンドAPI

### 正常系
- 全エンドポイントのGET/POST/PUT/DELETEリクエスト
- 正しいステータスコード (200, 201, 204)
- レスポンスボディの形式と内容
- データベースCRUD操作の確認

### 異常系
- バリデーションエラー (400)
- 認証エラー (401) ※認証がある場合
- 存在しないリソースへのアクセス (404)
- 不正なリクエストボディ
- 必須フィールドの欠落

### 境界値
- 空データの送信
- 最大長の文字列
- 空のリスト / コレクション

### テスト実行例
```bash
# curlでのAPIテスト
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/resource
curl -s -X POST http://localhost:8000/api/resource -H "Content-Type: application/json" -d '{"name":"test"}'
curl -s http://localhost:8000/api/resource/999  # 存在しないリソース
```

## フロントエンド

### 正常系
- 全画面の表示確認 (HTTPステータス200)
- 主要なUIコンポーネントの表示
- フォーム送信の動作
- ページ遷移

### 異常系
- エラー時のUI表示
- ネットワークエラー時の表示

### 境界値
- 空データ時の表示
- 長いテキストの表示

### テスト実行例
```bash
# ページ表示確認
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
curl -s http://localhost:3000/ | grep -c "<title>"
```

## フルスタック統合

### 正常系
- エンドツーエンドのCRUDシナリオ
- フロントエンド → バックエンドのAPI連携
- データの永続化と取得

### 異常系
- API側エラー時のフロントエンド表示
- バックエンド停止時のフロントエンド挙動

### テスト実行例
```bash
# 統合テスト: 作成→取得→更新→削除
curl -s -X POST http://localhost:8000/api/items -H "Content-Type: application/json" -d '{"name":"test"}'
curl -s http://localhost:8000/api/items
curl -s -X PUT http://localhost:8000/api/items/1 -H "Content-Type: application/json" -d '{"name":"updated"}'
curl -s -X DELETE http://localhost:8000/api/items/1
```

## Docker環境でのテスト

Docker環境が必要な場合:

1. `docker compose up -d` でサービスを起動
2. サービスの起動完了を待つ (`docker compose logs` で確認)
3. テストを実行
4. テスト後に `docker compose down` で停止

```bash
# Docker環境での起動確認
docker compose ps
docker compose logs --tail=20 <service-name>
```
