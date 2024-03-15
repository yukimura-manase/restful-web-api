# REST ful な Web API Server を構築する

- RESTful Web API の Sample Project

- 今回は「User に関する CRUD 処理を RESTful Web API として実装すると、どうなるか？」という Sample になります。

## User に関する 4 つのエンドポイントを実装する Sample

- RESTful API 設計において、ユーザー情報の取得、新規作成、更新、削除に関連するエンドポイントを設計する

1. User 情報・取得

   - GET 通信

     1. `/users`

        - User の一覧データを取得する

     2. `/users/{user_id}`

        - 特定(user_id)の User の情報を取得します。

2. User 新規作成

   - POST 通信

   1. `/users`

      - User データを新規作成する

      - User 情報は、リクエストボディに含めます。

3. User 情報・更新 (部分 Update)

   - PATCH 通信: `/users/{user_id}`

     - 特定(user_id)の User の情報を部分的に Update します。

     - Update する情報をリクエストボディに含めます。

4. User 削除

   - DELETE 通信

   1. `/users/{user_id}`

      - 特定(user_id)の User の情報を削除する
