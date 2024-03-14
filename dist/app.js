const express = require("express");
const app = express();
const port = 3000;

// data-store.json を読み込む
const fs = require("fs");
const dataStorePath = "./data-store/data-store.json";

// body-parser を使用する (HTTPリクエストのボディをパースする)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
let dataStore = [];
try {
  dataStore = JSON.parse(fs.readFileSync(dataStorePath, "utf8"));
} catch (e) {
  console.log(e);
}
console.log("dataStore:", dataStore);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.json({ pet: "cat" });
  console.log("API Server is running");
  res.end();
});

// User データの新規登録
app.post("/signup", (req, res) => {
  // HTTPリクエストのボディを出力
  console.log(req.body);
  console.log("POSTリクエストを受け取りました");

  // user_id と password を取得する
  const user_id = req.body?.user_id ?? false;
  const password = req.body?.password ?? false;

  // user_id と password がない場合は、400 Bad Request を返す
  if (!user_id || !password) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "required user_id and password",
    });
    return;
  }

  // user_id が 6文字以上20文字以内の半角英数字であるかどうかを確認する
  if (!/^[a-zA-Z0-9]{6,20}$/.test(user_id)) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "invalid user_id",
    });
    return;
  }

  // password が 8文字以上20文字以内の半角英数字であるかどうかを確認する
  if (!/^[a-zA-Z0-9]{8,20}$/.test(password)) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "invalid password",
    });
    return;
  }

  // nickname と comment を取得する
  const nickname = req.body.nickname;
  const comment = req.body.comment;

  // user_id が既に存在する場合は、400 を返す
  const user = dataStore.find((user) => user.user_id === user_id);
  if (user) {
    res.status(400).json({
      message: "Account creation failed",
      cause: "already same user_id is used",
    });
    return;
  }

  // nickname と comment がある場合は、dataStore に追加する
  if (nickname && comment) {
    // アカウントを新規作成する (dataStore に追加する)
    dataStore.push({ user_id, password, nickname, comment });
  } else {
    // アカウントを新規作成する (dataStore に追加する)
    // nickname と comment がない場合は、 user_id と password だけを dataStore に追加する
    dataStore.push({ user_id, password, nickname: user_id });
  }

  // dataStore を data-store.json に保存する
  fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2), "utf8");

  // Account 登録完了のレスポンスを返す
  res.json({
    message: "Account successfully created",
    user: {
      user_id,
      nickname,
    },
  });
});

// User データの取得
app.get("/users/:user_id", (req, res) => {
  console.log("GETリクエストを受け取りました");

  // authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");

  console.log("user_id:", user_id);
  console.log("password:", password);

  // user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );

  if (authUser) {
  } else {
    // 認証ユーザーが見つからない場合は、401 Unauthorized を返す
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }

  // user_id を取得する
  const paramsUserId = req.params.user_id;
  console.log("paramsUserId:", paramsUserId);

  // dataStore から user_id に一致するデータを取得する
  const user = dataStore.find((user) => user.user_id === paramsUserId);
  console.log("user:", user);

  let response = {};

  if (user) {
    // User に nickname がある場合
    if (user.nickname) {
      response = {
        message: "User details by user_id",
        user_id: user.user_id,
        nickname: user.nickname,
        comment: user.comment,
      };
    } else {
      // User に nickname がない場合
      response = {
        message: "User details by user_id",
        user_id: user.user_id,
        nickname: user.user_id,
      };
    }
  } else {
    response = {
      message: "No User found",
    };
    res.status(404).json(response);
    return;
  }

  // レスポンスを返す
  res.json(response);
});

// User データの更新
app.patch("/users/:user_id", (req, res) => {
  // authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");

  console.log("user_id:", user_id);
  console.log("password:", password);

  // user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );

  // 該当のユーザーが見つからない場合は、401 Unauthorized を返す
  if (!authUser) {
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }
});

// User データの削除
app.post("/close", (req, res) => {
  // authorization ヘッダーを取得する
  const authorization = req.headers.authorization;
  console.log("authorization:", authorization);

  // authorization ヘッダーから、Base64 エンコードされた文字列を取得する ( user_id:password でエンコードされている)
  const base64 = authorization.split(" ")[1];
  console.log("base64:", base64);

  // Base64 エンコードされた文字列をデコードする
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  console.log("decoded:", decoded);

  // デコードされた文字列を user_id と password に分割する
  const [user_id, password] = decoded.split(":");

  console.log("user_id:", user_id);
  console.log("password:", password);

  // user_id と password が一致するデータが dataStore にあるかどうかを確認する
  const authUser = dataStore.find(
    (user) => user.user_id === user_id && user.password === password
  );

  //
  if (authUser) {
    // 該当するユーザーを dataStore から削除する
    dataStore = dataStore.filter((user) => user.user_id !== user_id);

    // dataStore を data-store.json に保存する
    fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2), "utf8");

    // Account 削除完了のレスポンスを返す
    res.json({ message: "Account and user successfully removed" });
  } else {
    // 認証ユーザーが見つからない場合は、401 Unauthorized を返す
    res.status(401).json({ message: "Authentication Failed" });
    return;
  }
});
