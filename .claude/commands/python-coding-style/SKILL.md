---
name: python-coding-style
description: Pythonコーディング規約チェックとリファクタリング支援。Pythonコードのスタイルレビュー、命名規則修正、インデント・空白の調整、インポート整理、ドキュストリング追加などの作業時に使用。「Python約」「コードスタイル」「リント」「フォーマット」「命名規則」などのキーワードで発動。
---

# Python PEP8 スタイルガイド

PEP8に準拠したPythonコードを書くためのガイドライン。

## コードレイアウト

### インデント

4スペースを使用。タブは禁止。

```python
# Good
def long_function_name(
        var_one, var_two,
        var_three, var_four):
    print(var_one)

# Good - ハンギングインデント
foo = long_function_name(
    var_one, var_two,
    var_three, var_four)

# Good - 括弧揃え
foo = long_function_name(var_one, var_two,
                         var_three, var_four)
```

### 最大行長

- コード: **79文字**
- ドキュストリング/コメント: **72文字**
- チーム合意で最大99文字まで許容

```python
# Good - 括弧で暗黙的に行継続
if (condition_one
        and condition_two
        and condition_three):
    do_something()

# Good - バックスラッシュ（括弧が使えない場合のみ）
with open('/path/to/file') as file_one, \
     open('/path/to/other') as file_two:
    file_two.write(file_one.read())
```

### 二項演算子での改行

演算子の**前**で改行（Knuthスタイル）。

```python
# Good
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction)

# Bad
income = (gross_wages +
          taxable_interest +
          (dividends - qualified_dividends) -
          ira_deduction)
```

### 空白行

```python
# トップレベル: 2行空ける
class FirstClass:
    pass


class SecondClass:
    pass


def top_level_function():
    pass


# メソッド間: 1行空ける
class MyClass:
    def method_one(self):
        pass

    def method_two(self):
        pass
```

## インポート

### 順序と配置

```python
# 1. 標準ライブラリ
import os
import sys
from typing import List, Optional

# 2. サードパーティ
import numpy as np
import pandas as pd
from django.conf import settings

# 3. ローカル
from mypackage import mymodule
from mypackage.subpackage import helper
```

### インポートのルール

```python
# Good - 1行に1モジュール
import os
import sys

# Bad
import os, sys

# Good - from import は複数可
from subprocess import Popen, PIPE

# Bad - ワイルドカード禁止
from module import *
```

## 命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| モジュール | 小文字、短く | `mymodule`, `utils` |
| パッケージ | 小文字、短く | `mypackage` |
| クラス | CapWords | `MyClass`, `HTTPServer` |
| 例外 | CapWords + Error | `ValueError`, `CustomError` |
| 関数 | snake_case | `calculate_total()` |
| メソッド | snake_case | `get_value()` |
| 変数 | snake_case | `user_name`, `total_count` |
| 定数 | UPPER_SNAKE | `MAX_SIZE`, `DEFAULT_VALUE` |
| 非公開 | _leading | `_internal_method()` |
| マングリング | __double | `__private_attr` |

```python
# Good
class HTTPServerError(Exception):
    MAX_RETRIES = 3

    def __init__(self, message: str):
        self._error_code = None
        self.message = message

    def get_error_details(self) -> dict:
        return {"message": self.message}

# Bad
class httpServerError(Exception):  # クラスはCapWords
    max_retries = 3  # 定数はUPPER_SNAKE

    def GetErrorDetails(self):  # メソッドはsnake_case
        pass
```

## 空白

### 括弧内

```python
# Good
spam(ham[1], {eggs: 2})
foo = (0,)

# Bad
spam( ham[ 1 ], { eggs: 2 } )
foo = (0, )
```

### カンマ・コロン

```python
# Good
x, y = 1, 2
dct = {'key': value}
lst = [1, 2, 3]

# Bad
x , y = 1 , 2
dct = {'key' : value}
```

### 演算子

```python
# Good - 代入・比較は前後にスペース
x = 1
y == 2
z is not None

# Good - 優先度の高い演算子はスペースなし
x = x*2 - 1
c = (a+b) * (a-b)

# Bad
x=1
y==2
x = x * 2 - 1
```

### 引数のデフォルト値

```python
# Good
def make_complex(real, imag=0.0):
    return complex(real, imag)

# Bad
def make_complex(real, imag = 0.0):
    return complex(real, imag)
```

### 型アノテーション

```python
# Good
def greeting(name: str) -> str:
    return f"Hello, {name}"

code: int
data: dict[str, int] = {}

# Bad
def greeting(name:str)->str:
    return f"Hello, {name}"
```

## コメントとドキュストリング

### コメント

```python
# Good - 完全な文、先頭大文字
# This is a block comment explaining the following code.
# It can span multiple lines if needed.
x = x + 1

x = x + 1  # Increment counter for retry logic

# Bad
x = x + 1  # increment x
```

### ドキュストリング

```python
def fetch_data(url: str, timeout: int = 30) -> dict:
    """URLからデータを取得して辞書として返す。

    Args:
        url: 取得先のURL
        timeout: タイムアウト秒数

    Returns:
        取得したデータを含む辞書

    Raises:
        ConnectionError: 接続に失敗した場合
        TimeoutError: タイムアウトした場合
    """
    pass


class DataProcessor:
    """データ処理を行うクラス。

    Attributes:
        data: 処理対象のデータ
        config: 設定辞書
    """

    def __init__(self, data: list, config: dict = None):
        """DataProcessorを初期化する。

        Args:
            data: 処理対象のデータリスト
            config: オプションの設定辞書
        """
        self.data = data
        self.config = config or {}
```

## プログラミング推奨事項

### None比較

```python
# Good
if x is None:
    pass
if x is not None:
    pass

# Bad
if x == None:
    pass
if x != None:
    pass
```

### 真偽値チェック

```python
# Good
if items:  # 空でないことを確認
    pass
if not items:  # 空であることを確認
    pass
if flag:  # Trueであることを確認
    pass

# Bad
if len(items) > 0:
    pass
if items != []:
    pass
if flag == True:
    pass
```

### 例外処理

```python
# Good - 具体的な例外をキャッチ
try:
    value = collection[key]
except KeyError:
    return default_value

# Bad - 広すぎる例外
try:
    value = collection[key]
except Exception:
    return default_value
```

### with文でリソース管理

```python
# Good
with open('file.txt') as f:
    content = f.read()

# Bad
f = open('file.txt')
content = f.read()
f.close()
```

### 文字列の結合

```python
# Good
result = ''.join(items)

# Bad - ループ内での += は非効率
result = ''
for item in items:
    result += item
```

### lambda vs def

```python
# Good
def double(x):
    return x * 2

# Bad - lambdaを変数に代入
double = lambda x: x * 2
```

## 型ヒント (PEP 484/585)

```python
from typing import Optional, Union
from collections.abc import Sequence

def process_items(
    items: list[str],
    config: dict[str, int] | None = None,
    callback: Callable[[str], bool] | None = None,
) -> tuple[int, list[str]]:
    """型ヒント付きの関数例。"""
    pass

# Python 3.10+ では Union の代わりに | を使用
def get_name(user_id: int) -> str | None:
    pass
```

## ツール

### パッケージマネージャー

**uv**を使用（pip の代わりに推奨）:

```bash
# uv のインストール
curl -LsSf https://astral.sh/uv/install.sh | sh

# パッケージのインストール
uv pip install ruff mypy

# 仮想環境の作成と有効化
uv venv
source .venv/bin/activate

# requirements.txt からインストール
uv pip install -r requirements.txt

# プロジェクト依存関係の同期（pyproject.toml使用時）
uv sync
```

### リンター・フォーマッター

| ツール | 用途 |
|--------|------|
| `ruff` | 高速リンター + フォーマッター（推奨） |
| `black` | コードフォーマッター |
| `isort` | インポート整理 |
| `flake8` | スタイルチェッカー |
| `mypy` | 型チェッカー |

```bash
# ruff（推奨）
ruff check .
ruff format .

# black + isort
black .
isort .

# flake8
flake8 .
```

## 参考資料

- [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 484 – Type Hints](https://peps.python.org/pep-0484/)
- [PEP 585 – Type Hinting Generics](https://peps.python.org/pep-0585/)
