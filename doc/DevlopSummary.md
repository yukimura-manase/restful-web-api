## 処理実装のポイントなど

### 共通処理

- User の新規登録処理、以外は、Request User が認証ユーザーがどうか？ を Check する

1. authorization ヘッダーを取得して、Base64 エンコードをデコードして、`user_id`と`password`を取得する

2. 認証ユーザーかどうかを Check する。

   - 認証ユーザーの場合は、そのまま処理を続行する。

   - 認証ユーザーからの Request ではない場合は、401 Unauthorized を返す。

### User の新規登録

- `/users` のエンドポイントに対する Post 通信では User の新規登録を受け付ける。

1. バリデーション Check 　を実施する

   - user_id と password がない場合は、400 Bad Request を返す。

   - user_id が 6 文字以上 20 文字以内の半角英数字であるかどうかを確認する。

   - password が 8 文字以上 20 文字以内の半角英数字であるかどうかを確認する。

   - user_id が既に存在する場合(User 登録がある場合)は、400 を返す。

2. 上記のエラーパターンに該当しなければ、 Account を作成して、登録完了のレスポンスを返す。

### User データの取得 Ver. すべての User の情報を取得する

- `/users` のエンドポイントに対する Get 通信では User データの一覧取得を受け付ける。

0. 共通の認証処理
1. User 一覧を返却する。

### User データの取得 Ver. 特定の User の情報を取得する

- `/users/:user_id`のエンドポイントに対する Get 通信では、特定の User データの取得を受け付ける。

0. 共通の認証処理
1. `user_id` を Query Parameter として受け取る
2. 取得 Request の User が存在しない場合は、404 エラーを返す。
3. User データが存在する場合は、これを返却する。

### User データの更新

- `/users/:user_id` のエンドポイントに対する PUT 通信では User データの更新を受け付ける。

0. 共通の認証処理
1. `user_id` を Query Parameter として受け取る
2. 該当 User の nickname と comment を更新する

### User データの削除

- `/users/:user_id` のエンドポイントに対する Delete 通信では User データの削除を受け付ける。

0. 共通の認証処理
1. `user_id` を Query Parameter として受け取る
2. 該当 User のデータを削除する
