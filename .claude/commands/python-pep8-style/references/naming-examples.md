# 命名規則の詳細例

## モジュール名

```python
# Good
import mymodule
import db_utils
import http_client

# Bad
import MyModule
import dbUtils
import HTTPClient
```

## クラス名

```python
# Good - CapWords (PascalCase)
class MyClass:
    pass

class HTTPServer:
    pass

class XMLParser:
    pass

class OAuth2Client:
    pass

# Bad
class myClass:  # 先頭小文字
    pass

class my_class:  # snake_case
    pass

class MYCLASS:  # 全大文字
    pass
```

## 例外クラス

```python
# Good - CapWords + "Error" サフィックス
class ValidationError(Exception):
    pass

class DatabaseConnectionError(Exception):
    pass

class AuthenticationError(Exception):
    pass

# 警告クラスは "Warning"
class DeprecationWarning(Warning):
    pass
```

## 関数名

```python
# Good - snake_case
def calculate_total():
    pass

def get_user_by_id(user_id: int):
    pass

def fetch_data_from_api():
    pass

# Bad
def calculateTotal():  # camelCase
    pass

def GetUserById(user_id):  # PascalCase
    pass
```

## 変数名

```python
# Good
user_name = "John"
total_count = 100
is_valid = True
http_response = get_response()

# Bad
userName = "John"  # camelCase
TotalCount = 100   # PascalCase
isvalid = True     # 区切りなし
```

## 定数

```python
# Good - 全大文字 + アンダースコア
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30
PI = 3.14159
DATABASE_URL = "postgresql://..."
API_KEY = "..."

# Bad
MaxConnections = 100
max_connections = 100
defaultTimeout = 30
```

## 非公開メンバー

```python
class MyClass:
    # 非公開（内部使用のみ）
    _internal_value = 0

    def _private_method(self):
        """内部でのみ使用するメソッド"""
        pass

    # 名前マングリング（サブクラスでの衝突を避ける）
    __mangled_name = "only accessible as _MyClass__mangled_name"

    def __mangled_method(self):
        pass
```

## 特殊メソッド（ダンダー）

```python
class MyClass:
    def __init__(self):
        pass

    def __str__(self):
        return "MyClass instance"

    def __repr__(self):
        return "MyClass()"

    def __eq__(self, other):
        return isinstance(other, MyClass)

    def __len__(self):
        return 0

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
```

## 型変数

```python
from typing import TypeVar, Generic

# Good - 短い大文字または説明的な名前
T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')
T_co = TypeVar('T_co', covariant=True)
T_contra = TypeVar('T_contra', contravariant=True)

# 説明的な型変数
AnyStr = TypeVar('AnyStr', str, bytes)
Number = TypeVar('Number', int, float)
```

## 避けるべき名前

```python
# Bad - 1文字の紛らわしい名前
l = 1  # 'l' は '1' と紛らわしい
O = 0  # 'O' は '0' と紛らわしい
I = 1  # 'I' は 'l' や '1' と紛らわしい

# Good - 明確な名前を使う
length = 1
origin = 0
index = 1

# 短いループ変数は許容
for i in range(10):
    pass

for x, y in coordinates:
    pass
```

## 略語の扱い

```python
# Good - 略語は大文字を維持
class HTTPServer:
    pass

class XMLParser:
    pass

# Good - 略語が先頭の場合も同様
class HTMLElement:
    pass

# ただし、関数/変数では小文字
http_server = HTTPServer()
xml_parser = XMLParser()
html_element = HTMLElement()
```
