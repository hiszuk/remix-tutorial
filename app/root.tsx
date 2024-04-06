import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
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
 * ?q=xxxで名前によるコンタクトデータの絞り込みに対応する
 * URLパラメータをリクエストから取り出せるように引数を追加する
 */
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  /**
   * URLパラメータを取り出す
   */
  const url = new URL(request.url);

  /**
   * URLパラメータから"q"のパラメータの値を取り出す
   */
  const q = url.searchParams.get("q");

  /**
   * qに設定された名前と一部一致するリストを取得する
   * q自体がない、または、qに何も設定されていない場合は全件取得
   */
  const contacts = await getContacts(q);

  /**
   * 戻り値にqを追加する
   */
  return json({ contacts, q });
};

/**
 * actionファンクションをエクスポートすることで
 * fromのsubmit時に空のコンタクトデータを追加します
 * その後自動で編集ページ遷移させます
 */
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  /**
   * useLoaderData()フックはloaderによって読み込まれたデータを取得できます
   * 戻り値にqを追加し検索窓の初期値とする
   */
  const { contacts, q } = useLoaderData<typeof loader>();

  /**
   * useNavigation()フックはpending状態のナビゲーションを提供します
   */
  const navigation = useNavigation();

  /**
   * submitをプログラム的に制御するフックを導入
   */
  const submit = useSubmit();

  /**
   * 入力値とURLParamsを同期する
   */
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

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
            <Form
              id="search-form"
              onChange={(event) => submit(event.currentTarget)}
              role="search"
            >
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q || ""}
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
                    {/* 選択中のカードを強調表示する */}
                    <NavLink
                      className={({ isActive, isPending }) => 
                        isActive
                          ? "active"
                          : isPending 
                          ? "pending"
                          : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
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
                    </NavLink>
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
        <div
          className={
            navigation.state === "loading" ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
