# よくある間違いと修正例

## インデント

### 間違い: 継続行のインデントが不適切

```python
# Bad - 引数が揃っていない
def long_function_name(var_one, var_two,
    var_three, var_four):  # 4スペースだと本体と区別がつかない
    print(var_one)

# Good - 8スペースで区別
def long_function_name(
        var_one, var_two,
        var_three, var_four):
    print(var_one)

# Good - 括弧揃え
def long_function_name(var_one, var_two,
                       var_three, var_four):
    print(var_one)
```

## 空白

### 間違い: 括弧内の余分なスペース

```python
# Bad
spam( ham[ 1 ], { eggs: 2 } )
func (arg)  # 関数名と括弧の間

# Good
spam(ham[1], {eggs: 2})
func(arg)
```

### 間違い: コロンの前後のスペース

```python
# Bad
ham[1 : 9], ham[1 :9 : 3]
dct['key' ] = value
x = 1 : 5

# Good
ham[1:9], ham[1:9:3]
dct['key'] = value
ham[lower:upper], ham[lower:upper:]
```

### 間違い: 代入演算子のスペース不足/過剰

```python
# Bad
x=1
y = x=1  # 混在
long_variable   =   1  # 過剰

# Good
x = 1
y = x = 1
long_variable = 1
```

### 間違い: デフォルト引数のスペース

```python
# Bad
def func(arg1, arg2 = None):
    pass

# Good
def func(arg1, arg2=None):
    pass

# ただし型アノテーション付きの場合は異なる
def func(arg1, arg2: int = None):  # これは正しい
    pass
```

## インポート

### 間違い: 1行に複数モジュール

```python
# Bad
import sys, os, json

# Good
import json
import os
import sys
```

### 間違い: ワイルドカードインポート

```python
# Bad
from module import *

# Good
from module import specific_function, SpecificClass
```

### 間違い: インポート順序が不適切

```python
# Bad - 順序がバラバラ
from mypackage import helper
import numpy
import os
from django.conf import settings

# Good - 標準 → サードパーティ → ローカル
import os

import numpy
from django.conf import settings

from mypackage import helper
```

## 命名

### 間違い: クラス名がsnake_case

```python
# Bad
class my_data_processor:
    pass

# Good
class MyDataProcessor:
    pass
```

### 間違い: 定数が小文字

```python
# Bad
max_retries = 3
default_timeout = 30

# Good
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30
```

### 間違い: メソッド名がcamelCase

```python
# Bad
class MyClass:
    def getData(self):
        pass

    def setConfig(self, config):
        pass

# Good
class MyClass:
    def get_data(self):
        pass

    def set_config(self, config):
        pass
```

## 比較

### 間違い: Noneを==で比較

```python
# Bad
if x == None:
    pass

if x != None:
    pass

# Good
if x is None:
    pass

if x is not None:
    pass
```

### 間違い: 真偽値を明示的に比較

```python
# Bad
if flag == True:
    pass

if flag == False:
    pass

if len(items) > 0:
    pass

# Good
if flag:
    pass

if not flag:
    pass

if items:  # 空でないことを確認
    pass
```

### 間違い: not ... is を使用

```python
# Bad
if not x is None:
    pass

# Good
if x is not None:
    pass
```

## 例外

### 間違い: 裸のexcept

```python
# Bad
try:
    do_something()
except:  # 全ての例外をキャッチ
    pass

# Bad
try:
    do_something()
except Exception:  # 広すぎる
    pass

# Good
try:
    do_something()
except ValueError:
    pass
except (TypeError, KeyError):
    pass
```

### 間違い: except: pass

```python
# Bad - エラーを握りつぶす
try:
    do_something()
except Exception:
    pass

# Good - 少なくともログを残す
try:
    do_something()
except Exception:
    logger.exception("Failed to do something")
```

## 文字列

### 間違い: ループ内で文字列結合

```python
# Bad - O(n²) の計算量
result = ""
for item in items:
    result += str(item)

# Good - O(n)
result = "".join(str(item) for item in items)
```

### 間違い: .startswith()/.endswith()の代わりにスライス

```python
# Bad
if name[:4] == "test":
    pass

if filename[-3:] == ".py":
    pass

# Good
if name.startswith("test"):
    pass

if filename.endswith(".py"):
    pass
```

## その他

### 間違い: lambdaを変数に代入

```python
# Bad
double = lambda x: x * 2

# Good
def double(x):
    return x * 2
```

### 間違い: 可変デフォルト引数

```python
# Bad - 共有される可変オブジェクト
def append_item(item, items=[]):
    items.append(item)
    return items

# Good
def append_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### 間違い: return文の一貫性がない

```python
# Bad
def get_value(condition):
    if condition:
        return "value"
    # 暗黙的にNoneを返す

# Good - 明示的なreturn
def get_value(condition):
    if condition:
        return "value"
    return None
```
