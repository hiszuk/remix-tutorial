# Remix Tutorial(30min) hands-on

## `URLSearchParaams` and `GET` Submissions

Formの`method=GET`の際の`URLSearchParams`からのデータ取り出し方法について[チュートリアル](https://remix.run/docs/en/main/start/tutorial#urlsearchparams-and-get-submissions)に従って実装しながら確認します。

`method=GET`なので、loader関数で処理します。

リクエストからURLパラメータを取り出す
```
  const url = new URL(request.url);
```

URLパラメータから特定の値を取り出す
```
  const q = url.searchParams.get("q");
```

## Synchronizing URLs to Form State

下記のUX上の課題について[チュートリアル](https://remix.run/docs/en/main/start/tutorial#synchronizing-urls-to-form-state)に従って対応します。

1. ブラウザ「戻る」ボタンをクリックしたとき検索窓に値が入っていてもフィルターされていない状態でサイドバーにリストが表示される
2. ブラウザ「更新」し再読み込みした際にURLにはフィルタ条件が残っているが検索窓には何も表示されていない状態になる

### 対策１

`loader`関数から`q`も戻しフォームのデフォルト値としてセットする

### 対策2

検索窓の値とURLSearchParamsを同期する

## Submitting `Form`'s onChange

検索窓の文字が変わる毎に絞り込み検索ができるように[チュートリアル](https://remix.run/docs/en/main/start/tutorial#submitting-forms-onchange)に従って対応します。

