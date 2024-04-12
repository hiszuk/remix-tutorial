# Remix Tutorial Advanced hands-on

Remix Tutorial の Advanced hands-on として以下の内容に挑戦します。

1. ~~storybookを導入してコンポーネントのstoryを作る~~
2. storybookのplay機能を使ってinteraction testを書く
3. storybookのテストランナーでコマンドラインからテストを起動する
4. chromaticを設定してビジュアル・リグレッション・テストの環境を作る

# 1.5 storiesを作りやすいようにディレクトリ構成を見直す

コンポーネントのstoriesやテストを作成していったとき、関連するファイルがひとつのディレクトリに集まっていたほうがわかりやすい(`Co-locates Modules`)ので、[`Convertional Route Folders`](https://remix.run/docs/en/main/discussion/routes#conventional-route-folders)に従って、ディレクトリ構成を見直します。

## ディレクトリ構成見直し

```
app/
├── routes/
│   ├── _index/
│   │   └── route.tsx
│   ├── contacts.$contactId/
│   │   ├── contactId.stories.tsx
│   │   └── route.tsx
│   ├── contacts.$contactId_.edit/
│   │   └── route.tsx
│   └── contacts.$contactId.destroy/
│       └── route.tsx
└── root.tsx
```

ディレクトリ構成を見直すことでimportのpathを適宜見直す。

## 動作確認

```
npm run dev
```

構成変更前と同じ動作をすることを確認する。

