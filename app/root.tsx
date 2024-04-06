import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

/**
 * スタイルシートを指定する
 */
import appStylesHref from "./app.css?url";

/**
 * チュートリアルのデータハンドリング用のモジュールapp/data.tsから
 * コンタクトリスト取得のコンポーネントgetContactsをインポートします
 * 空のコンタクトデータを追加するcreateEmptyContactもインポートします
 */
import { createEmptyContact, getContacts } from "./data";

/**
 * exportしたlinksが<head> ~ </head>内の<Links />の部分に<link>として展開される
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

/**
 * loaderファンクションをエクスポートすることで
 * app/root.tsxレンダリング前にデータを取得します
 */
export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

/**
 * actionファンクションをエクスポートすることで
 * fromのsubmit時に空のコンタクトデータを追加します
 */
export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

export default function App() {
  /**
   * useLoaderData()フックはloaderによって読み込まれたデータを取得できます
   */
  const { contacts } = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {/* 取得したコンタクトリストをサイドバーに表示する */}
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
