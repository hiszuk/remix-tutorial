# Remix Tutorial(30min) hands-on

## Active Link Styling

サイドバーで現在表示中のコンタクトデータがどれかわかるように [NavLink](https://remix.run/docs/en/main/components/nav-link)を導入します。

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#active-link-styling)に従い、`<Link>`を`<NavLink>`に変更します。


### 動作確認

下図のような表示になります。

![メニューハイライト](https://remix.run/docs-images/contacts/15.webp)

## Global Pending UI

[useNavigation](https://remix.run/docs/en/main/hooks/use-navigation)フックを使ってコンポーネントが読み込み中の状態を表現します。

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#global-pending-ui)に従い、コンタクトカード部分に読み込み中状態を設定します。

### データ読み込みに遅れを仕込む

Pending動作確認のため`app/data.ts`の`getContact`関数に1000msの遅れを仕込む

```
export async function getContact(id: string) {
  // Pending UI検証用にデータ読み込みに1秒の遅れを仕込む
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return fakeContacts.get(id);
}
```
### 動作確認

サイドバーで人を切り替える度に半透明のマスクがかかることがわかります。

![Pending UI](https://remix.run/docs-images/contacts/16.webp)
