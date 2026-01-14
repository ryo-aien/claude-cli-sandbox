---
name: install-skill
description: |
  skills.json に定義されたスキル/プラグインを一括インストールする。
  Dockerコンテナ起動時など、毎回スキルを再インストールする必要がある環境で使用。
  トリガー: 「スキルをインストール」「プラグインをセットアップ」「/install-skill」
---

# スキル一括インストーラー

`skills.json` に定義されたプラグインとスキルを一括でインストールする。

## 使用方法

```
/install-skill
```

## 設定ファイル

`skills.json` を読み込み、定義されたスキルをインストールする。

### skills.json の形式

```json
{
  "plugins": [
    {
      "name": "プラグイン名",
      "marketplace": "マーケットプレイスID（例: anthropics/skills）",
      "package": "パッケージ名@マーケットプレイス名",
      "comment": "説明（任意）"
    }
  ],
  "skills": [
    {
      "name": "スキル名",
      "source": "github:user/repo または market:skill-name",
      "enabled": true,
      "comment": "説明（任意）"
    }
  ]
}
```

## インストール手順

### 1. 設定ファイルを読み込む

```bash
cat .claude/commands/install-skill/skills.json
```

### 2. プラグインをインストール

各プラグインに対して以下を実行:

```bash
# マーケットプレイスを追加
/plugin marketplace add <marketplace>

# パッケージをインストール
/plugin install <package>
```

実際のコマンド例:
```bash
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
```

### 3. スキルをインストール（enabled: true のもののみ）

GitHub からのスキル:
```bash
git clone --depth 1 https://github.com/<user>/<repo> /tmp/claude/skill-temp
cp -r /tmp/claude/skill-temp/.claude/commands/* ~/.claude/commands/
rm -rf /tmp/claude/skill-temp
```

### 4. 結果を報告

インストールしたプラグイン/スキルの一覧を表示。

## スキルの追加方法

`skills.json` を編集してエントリを追加:

```json
{
  "plugins": [
    {
      "name": "new-plugin",
      "marketplace": "owner/repo",
      "package": "plugin-name@marketplace-name"
    }
  ]
}
```

## 注意事項

- プラグインのインストールには Claude Code の再起動が必要
- `enabled: false` のスキルはスキップされる
