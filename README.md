# Remix Tutorial(30min) hands-on

## URL Params in Loaders

サイドバーの名前をクリックするとURL部分が実際のIDに切り替わることが確認できます。

サイドバーで指定した人のコンタクトデータをカードに表示するために、URL部分に表示されたIDを利用します。

IDを取り出すためには`URL Parameters`を利用します。

ファイル名`contacts.$contactId.tsx`に含まれる`$contactId`を使用して、IDを`params.contactId`で取り出すことができます。

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#url-params-in-loaders)を参考に`app/routes/contacts.$contactId.tsx`を編集します。

ポイントは`app/root.tsx`でデータ取得してサイドバーに表示した時とほぼ同じです。

- `loader`でデータを取得する
- `useLoaderData()`で取得したデータを利用する

違うのは、コンタクトデータ1件を取得するためにID指定が必要なので、`params.contactId`でID取得し、コンタクトデータを1件取得するための関数`getContact`の引数に渡すことです。

## Valodating Params and Throwing Response

先のコードのままでは`params.contactId`がundefinedの可能性があるので警告が表示されます。

undefinedに対処するために`invariant`という関数を使うそうです。(詳細は各自調べてください・・)

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#validating-params-and-throwing-responses)を参考にundefinedの対処を行います。

### 動作確認

サイドメニューの名前をクリックしたら、該当する人のコンタクトカードが表示されるようになります。

![実際のコンタクトカード表示](https://remix.run/docs-images/contacts/10.webp)
