# Remix Tutorial(30min) hands-on

## Data Mutation

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#data-mutations)では簡単に`form`の動きについて触れられています。基本的には昔ながらの`form`で、`method`も`POST`か`GET`を使います。

通常の`form`と異なるところは、リクエストを直接サーバーに送るのではなく、クライアントサイドでルーティングされ`action`ファンクションに送ることです。

この部分は重要ですので[CodeZineの記事](https://codezine.jp/article/detail/18232?p=2)を参考に少し詳しく見ていきたいと思います。

### 記事でわかること

- Remixでは`<form>`要素を薄くラップした`<Form>`コンポーネントを使用する
- submit時はサーバーに直接データを送信するのではなく、`action`ファンクションにデータが送信される
- データ送信完了後は`<form>`によるHTMLフォームではページのリロードが発生するが、Remixではシングルページアプリケーションの挙動となりリロードは発生しない
- 送信完了後は画面表示用のJSONデータを非同期通信で取得し、Reactの状態更新として流し込まれるので更新された部分のみ再描画される

### 動作確認

実際にサイドバーの`New`ボタンをクリックすると起こることを確認しましょう。

`new`ボタンに該当するのは`app/root.tsx`の下記の部分です。

```
            <Form method="post">
              <button type="submit">New</button>
            </Form>
```

`New`ボタンをクリックすると下図の表示となります。

![NEWボタン押下](https://remix.run/docs-images/contacts/09.webp)

## Creating Contacts

[チュートリアル]()に従い`action`関数を`app/root.tsx`に追記します。

### 動作確認

再度`New`ボタンをクリックすると下図のように`No Name`が追加された状態でサイドバーが描画されます。

![新規データ作成](https://remix.run/docs-images/contacts/11.webp)

送信完了後にデータを自動的に読み込みサイドバーが再描画されたことがわかります。

