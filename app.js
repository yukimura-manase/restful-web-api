const express = require("express");
const app = express();
const port = 3000;

// data-store.json を読み込む
const fs = require("fs");
const dataStorePath = "./data-store/data-store.json";

/**
 * NOTE: body-parser を使用する
 * - HTTPリクエストのボディをパースするためのミドルウェア
 * - リクエストのボディを req.body に格納する
 */
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * NOTE: DataStore: Data の保管庫
 * - data-store.json のデータを保存 & Updateするために使用する
 * - Database の代わりに使用する
 */
let dataStore = [];
try {
  // Server起動時点で、DataStore に data-store.json のデータを読み込む
  dataStore = JSON.parse(fs.readFileSync(dataStorePath, "utf8"));
} catch (e) {
  console.log(e);
}
console.log("dataStore:", dataStore);

// ポート 3000 でサーバーを起動する
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// ルートパスにアクセスした場合のレスポンス
app.get("/", (req, res) => {
  res.json({ pet: "ぴゅぴゅ丸" });
  console.log("API Server is running");
  res.end();
});

// User データの新規登録エンドポイント: Create
app.post("/users", (req, res) => {
  // HTTPリクエストのボディを出力
  console.log(req.body);
  console.log("POSTリクエストを受け取りました");

  // 0. user_id と password を取得する
  const user_id = req.body?.user_id ?? false;
  const password = req.body?.password ?? false;

  console.log("user_id:", user_id);
  console.log("password:", password);

  // 1. user_id と password がない場合は、400 Bad Request を返す。
  if (!user_id || !password) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "required user_id and password",
    });
    console.error({
      message: "Account creation failed",
      cause: "required user_id and password",
    });
    return;
  }

  // 2. user_id が 6 文字以上 20 文字以内の半角英数字であるかどうかを確認する。
  if (!/^[a-zA-Z0-9]{6,20}$/.test(user_id)) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "invalid user_id",
    });
    return;
  }

  // 3. password が 8 文字以上 20 文字以内の半角英数字であるかどうかを確認する。
  if (!/^[a-zA-Z0-9]{8,20}$/.test(password)) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "invalid password",
    });
    return;
  }

  // 4. nickname と comment を取得する: ない場合は、空文字を代入する
  const nickname = req.body.nickname ?? "";
  const comment = req.body.comment ?? "";

  // 5. user_id が既に存在する場合は、400 を返す
  const user = dataStore.find((user) => user.user_id === user_id);
  if (user) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "already same user_id is used",
    });
    return;
  }

  // 6. アカウントを新規作成する (dataStore に追加する)
  dataStore.push({ user_id, password, nickname, comment });

  // 7. dataStore を data-store.json に保存する
  fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2), "utf8");

  // Account 登録完了のレスポンスを返す
  res.json({
    message: "Account successfully created",
    data: {
      user: {
        user_id,
        nickname,
      },
    },
  });
});

// User データの取得: Read Ver. すべての User の情報を取得する
app.get("/users", (req, res) => {
  console.log("GETリクエストを受け取りました");

  // 1. authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // 2. authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // 3. Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // 4. デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");

  console.log("user_id:", user_id);
  console.log("password:", password);

  // 5. user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );
  console.log("authUser:", authUser);

  // 6. 認証ユーザーでない場合は、401 Unauthorized を返す
  if (!authUser) {
    // 認証ユーザーが見つからない場合は、401 Unauthorized を返す
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }

  /** 7. User 一覧データ (Password の情報は含めない) */
  const users = dataStore.map((user) => {
    return {
      user_id: user.user_id,
      nickname: user.nickname,
      comment: user.comment,
    };
  });
  console.log("users:", users);

  // レスポンスを返す
  res.json({
    message: "All User details",
    data: users,
  });
});

// User データの取得: Read Ver. 特定の User の情報を取得する
app.get("/users/:user_id", (req, res) => {
  console.log("GETリクエストを受け取りました");

  // 1. authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // 2. authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // 3. Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // 4. デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");
  console.log("user_id:", user_id);
  console.log("password:", password);

  // 5. user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );
  console.log("authUser:", authUser);

  // 6. 認証ユーザーでない場合は、401 Unauthorized を返す
  if (!authUser) {
    // 認証ユーザーでない場合は、401 Unauthorized を返す
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }

  // 7. user_id を取得する
  const targetUserId = req.params.user_id;
  console.log("targetUserId:", targetUserId);

  // 8. dataStore から user_id に一致するデータを取得する
  const user = dataStore.find((user) => user.user_id === targetUserId);
  console.log("user:", user);

  let response = {};

  // 9. 該当のユーザーが見つかった場合は、該当のユーザーの情報を返す
  if (user) {
    response = {
      message: "User details by user_id",
      // Password 以外の User データを返却する
      data: {
        user_id: user.user_id,
        nickname: user.nickname,
        comment: user.comment,
      },
    };
    // レスポンスを返す
    res.json(response);
  } else {
    response = {
      message: "No User found",
    };
    res.status(404).json(response);
  }
});

// User データの更新: Update
app.patch("/users/:user_id", (req, res) => {
  console.log("User Update Request");

  // 1. authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // 2. authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // 3. Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // 4. デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");
  console.log("user_id:", user_id);
  console.log("password:", password);

  // 5. user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );
  console.log("authUser:", authUser);

  // 6. 認証ユーザーでない場合は、401 Unauthorized を返す
  if (!authUser) {
    // 認証ユーザーでない場合は、401 Unauthorized を返す
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }

  /** Update Target User Id */
  const targetUserId = req.params.user_id;
  const targetPassword = req.body.password;
  const nickname = req.body.nickname;
  const comment = req.body.comment;
  console.log("targetUserId:", targetUserId);
  console.log("nickname:", nickname);
  console.log("comment:", comment);

  // 7. 該当のユーザーが見つかった場合は、nickname, password, comment を更新する
  dataStore = dataStore.map((user) => {
    if (user.user_id === targetUserId) {
      user.nickname = nickname;
      user.password = targetPassword;
      user.comment = comment;
    }
    return user;
  });

  // 8. dataStore を data-store.json に保存する
  fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2), "utf8");

  // 9. 更新完了のレスポンスを返す
  res.json({ message: "User details successfully updated" });
});

// User データの削除: Delete
app.delete("/users/:user_id", (req, res) => {
  console.log("User Delete Request");

  // 1. authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // 2. authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // 3. Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // 4. デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");
  console.log("user_id:", user_id);
  console.log("password:", password);

  // 5. user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );
  console.log("authUser:", authUser);

  // 6. 認証ユーザーでない場合は、401 Unauthorized を返す
  if (!authUser) {
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }

  /** Delete Target User Id */
  const targetUserId = req.params.user_id;
  console.log("targetUserId:", targetUserId);

  // 7. 該当するユーザーを dataStore から削除する
  dataStore = dataStore.filter((user) => user.user_id !== targetUserId);

  // 8. dataStore を data-store.json に保存する
  fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2), "utf8");

  // 9. User 削除完了のレスポンスを返す
  res.json({ message: "User Account successfully removed" });
});
