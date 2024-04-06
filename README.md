# Remix Tutorial(30min) hands-on

## Client Side Routeing

メニューリンクをクリックするたびにページ全体を読み直すのではなく、シングル・ページ・アプリケーションのように内部ルーティングで表示を切り替えれるように`<a href>`を`<Link>`コンポーネントに変更します。

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#client-side-routing)を参考に`app/root.tsx`を変更します。

## Loading Data

コンポーネントへのデータ読み込みと読み込んだデータの利用は、`loader` と `useLoaderData` で行います。

`loader`ファンクションをエクスポートすることで、データを読み込んでからコンポーネントをレンダリングするようにできます。

### サイドバーへのデータ読み込みと表示

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#loading-data)に従い、`app/root.rsx`にデータロード部分を追加します。

チュートリアルのデータハンドリング用のモジュール`app/data.ts`からコンタクトリスト取得のコンポーネント`getContacts`をインポートします。
```
import { getContacts } from "./data";
```

`loader`ファンクションをエクスポートすることで、`app/root.tsx`レンダリング前にデータを取得します。
```
export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};
```

`useLoaderData()`フックは`loader`によって読み込まれたデータを取得できます。
```
  const { contacts } = useLoaderData();
```

## Type Interface

そのままではtypescriptの警告が出ますので、`typeof loader`を使用して`contact`型をを推論します。
```
  const { contacts } = useLoaderData<typeof loader>();
```

### 動作確認

下図のようにサイドバーにコンタクトリストが表示されます。

![サイドバーにデータロード](https://remix.run/docs-images/contacts/07.webp)
