# Remix Tutorial(30min) hands-on

## `Form`s Without Navigation

ポップアップや動的なフォームなどページ遷移を持たないデータのフェッチや、ページ遷移せずにデータを`action`関数に送信したい場合には、[useFetcher](https://remix.run/docs/en/main/hooks/use-fetcher)を利用します。

`useFetcher`はページ遷移しないで、`action`関数や`loader`関数とデータのやり取りができます。

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#forms-without-navigation)に従って⭐️マークをON/OFFする機能を追加します。

## Optimistic UI

`fetcher.formData`を利用して、データ送信後データが実際に更新される前にUIに値をセットすることができます。更新が失敗すれば変更は破棄され元の状態に戻ります。

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#optimistic-ui)に従って楽観的UIの機能を実装します。


