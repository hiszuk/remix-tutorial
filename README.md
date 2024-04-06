# Remix Tutorial(30min) hands-on

## The Contact Route UI

Remixにおけるルーティングは`app/routes`以下に配置したファイルのファイル名で行います。

（参考）[Route File Naming](https://remix.run/docs/en/main/file-conventions/routes)

今回のチュートリアルでは`Dot Delimiters`のルールでルーティングをしています。

- [Dot Delimiters](https://remix.run/docs/en/main/file-conventions/routes#dot-delimiters)
- [Dynamic Segments](https://remix.run/docs/en/main/file-conventions/routes#dynamic-segments)

```
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.$city.tsx
│   └── concerts.trending.tsx
└── root.tsx
```

| URL | ルーティング |
| --- | --- |
| / | app/routes/_index.tsx |
| /about | app/routes/about.tsx |
| /concerts/trending | app/routes/concerts.trending.tsx |
| /concerts/salt-lake-city | app/routes/concerts.$city.tsx |
| /concerts/san-diego | app/routes/concerts.$city.tsx |

IDなどURLの一部が動的に変わる場合(`Dynamic Segments`)は、`$`のプレフィックスを付けます。

### コンタクトページの作成

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#the-contact-route-ui)に従い、コンタクトページを作成します。

`app/routes/countacts.$contantId.tsx` を作成します。

### 注意事項

ソース中で現在うまく画像が生成できていないURLがあるので、別のものに置き換えておきます。

```
https://placekitten.com/g/200/200
```
↓
```
https://i.pravatar.cc/200
```

### 動作確認

`/contacts/1` にアクセスしてみてください。何も表示されない(！)はずです。

## Nested Routes and Outlets

`app/routes/contatcs.`で始まるファイルは親(`app/root.tsx`)の子コンポーネントとして`<Outlet />`部分にレンダリングされます。

### 子コンポーネントの配置

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#nested-routes-and-outlets)に従い`app/root.tsx`に`<Outlet />`を配置します。

### 動作確認

`/contacts/1` にアクセスしてみてください。今度は下のようなコンタクトカードが表示されましたね！

![コンタクトカードサンプル](https://remix.run/docs-images/contacts/06.webp)

