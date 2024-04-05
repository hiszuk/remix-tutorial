# Remix Tutorial(30min) hands-on

## The Root Route

`app/root.tsx` が最初にレンダリングされるコンポーネントになります。

よって、一般的にはグローバルなレイアウトを設定することが多いです。

## Adding Stylesheets with `links`

`app/root.tsx`内の`head`部分に着目してください。

```
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
```

この`<Links />`というコンポーネントの部分に、`export`した`links`の部品が展開されます。

```
import type { LinksFunction } from "@remix-run/node";
// existing imports

import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
```

全てのrouteは`links`ファンクションをエクスポート可能で、それぞれが集められて、`app/root.tsx`内の`<Links />`コンポーネントに展開されます。

![スタイルシートがあたった画面](https://remix.run/docs-images/contacts/04.webp)

