# RESTful Web API Sample

- RESTful Web API の Sample Project

- REST や、RESTful がわからない方は、こちらの記事をご覧ください。

  - [【Web API 設計 〜 理論編 〜】REST の核心に迫る！REST ful API は 4 原則ではなかった!? REST と ROA について](https://zenn.dev/aiq_dev/articles/48100d5b3f13fe)

- 今回は「User に関する CRUD 処理を RESTful Web API として実装すると、どうなるか？」という Sample になります。

## 使用技術

1. Express: Node.js のフレームワーク

2. DataStore: data-store.json

   - API 設計のポイントを学ぶための Sample プロジェクトなので、DB ではなく、JSON ファイルを簡易的な DataStore として用意しました。

## User に関する 4 つのエンドポイントを実装する Sample

- RESTful API 設計において、ユーザー情報の取得、新規作成、更新、削除に関連するエンドポイントを設計する

1. User 情報・取得

   - GET 通信: `/users`

     - User の一覧データを取得する

   - GET 通信: `/users/{user_id}`

     - 特定(user_id)の User の情報を取得します。

2. User 新規作成

   - POST 通信: `/users`

     - User データを新規作成する
     - User 情報は、リクエストボディに含めます。

3. User 情報・更新 (部分 Update)

   - PATCH 通信: `/users/{user_id}`

     - 特定(user_id)の User の情報を部分的に Update します。
     - Update する情報をリクエストボディに含めます。

4. User 削除

   - DELETE 通信: `/users/{user_id}`

     - 特定(user_id)の User の情報を削除する

### 参考・引用

1. [【Web API 設計 〜 理論編 〜】REST の核心に迫る！REST ful API は 4 原則ではなかった!? REST と ROA について](https://zenn.dev/aiq_dev/articles/48100d5b3f13fe)
