# Remix Tutorial(30min) hands-on

[Rmix公式のチュートリアル](https://remix.run/docs/en/main/start/tutorial)をやってみる！

![Remix公式](https://remix.run/docs-images/contacts/01.webp)

## 前提

チュートリアルにはnode 18.0.0以上が必要です。

nodeのバージョン管理ツールを導入するか、導入しない場合は、個人PCにて参加をお願いします。

（参考）[nodeバージョン管理ツール](https://qiita.com/heppokofrontend/items/fe1c3bc41a0ae943c2ca?0)

## 事前準備

ハンズ・オンでは環境設定やインストール時のトラブルを避けるため、事前にチュートリアルをダウンロードして画面を起動できるまで事前に準備をお願いします。

### チュートリアルインストール

[Rmix公式のチュートリアル](https://remix.run/docs/en/main/start/tutorial)にしたがい、セットアップします。

オプションは全てデフォルトのものを選択してください。

```
npx create-remix@latest --template remix-run/remix/templates/remix-tutorial
```

この段階でエラーになるかも知れません。

エラーの原因を確認するにはデバッグモードで実行します。

```
npx create-remix@latest --template remix-run/remix/templates/remix-tutorial --debug
```

```
Open an issue to report the problem at https://github.com/remix-run/remix/issues/new
FetchError: request to https://api.github.com/repos/remix-run/remix/tarball failed, reason: unable to get local issuer certificate
```

上記のようなエラーの場合、証明書が読み込めていないので、`ZscalerRootCA.crt` が読めるように環境変数を設定します。

証明書があるパスを{Path_To_CA}とします。（実際のファイルパスに置き換えてください）

PowerShellの場合
```
$env:NODE_EXTRA_CA_CERTS = "{Path_To_CA}\ZscalerRootCA.crt"
```

### チュートリアル起動

プロジェクトフォルダに移動します。
```
cd my-remix-app
```

チュートリアルアプリを起動します。
```
npm run dev
```

```
> dev
> remix vite:dev

Re-optimizing dependencies because vite config has changed
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

[http://localhost:5173](http://localhost:5173) にアクセスします。

下記のような画面が表示されれば起動に成功しています。

![チュートリアル初期画面](https://remix.run/docs-images/contacts/03.webp)

## まとめ

- Remixチュートリアル実施にはnode18.0.0以上が必要です
- 事前準備として下記をお願いします
  - node対応バージョンのインストール
  - チュートリアルのセットアップ(create-remix-app)


