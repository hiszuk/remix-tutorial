# Remix Tutorial(30min) hands-on

## Updating Data

[チュートリアル]()に従いコンタクト編集ページ(`app/routes/contacts.$contactId_.edit.tsx`)を作成します。

`$contactId_`のように末尾に`_`を付けることで、`app/routes/contacts.$contactId.tsx`にネストしないコンポーネントとして扱われます。

## Updating Contacts with `FormData`

[チュートリアル]()に従い、`Save`ボタンをクリックするとコンタクトの入力フォームの内容でデータを更新する`action`関数を作成します。

### 補足

フォームに入力されたデータを[formData()](https://developer.mozilla.org/en-US/docs/Web/API/FormData)を利用して取り出す
```
  const formData = await request.formData();
```

取り出した入力データを更新用の変数に[Object.fromEntries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)を利用して移送する
```
  const updates = Object.fromEntries(formData);
```

`redirect`はクライアントサイドのリダイレクトなのでスクロール位置やコンポーネント状態は保持される
```
  return redirect(`/contacts/${params.contactId}`);
```

## Redirecting new records to the edit page

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#redirecting-new-records-to-the-edit-page)に従い`New`ボタンをクリックしたらコンタクトカード編集ページが自動で開くようにします。

### 動作確認

`New`ボタンクリックするとコンタクトカード編集ページに自動で遷移します。

![自動で新規編集に遷移](https://remix.run/docs-images/contacts/14.webp)