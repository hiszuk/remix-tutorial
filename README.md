# Remix Tutorial(30min) hands-on

## Deleting Records

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#deleting-records)に従って、コンタクトカードの`Delete`ボタンを実装していきます。

`app/routes/contacts.$contactId.destroy.tsx`を作成します。

### 動作確認

コンタクトカードの`Delete`ボタンをクリックしてデータを削除できるようになりました。


## Index Routes

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#index-routes)に従って、Top画面に表示するコンテンツを作成します。

`app/routes/_index.tsx`を作成します。

### 動作確認

http://localhost:5173/　にアクセスすると下図のような表示となります。

![TOP画面](https://remix.run/docs-images/contacts/18.webp)

## Cancel Button

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#cancel-button)に従って、[useNavigate()](https://remix.run/docs/en/main/hooks/use-navigate)フックを使って`Cancel`ボタンが押されたら一つ前の画面に戻る機能を実装します。


### 動作確認

コンタクトカード編集画面で`Cancel`ボタンをクリックすると元の表示画面に戻るようになります。

