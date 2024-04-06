# Remix Tutorial(30min) hands-on

## Adding Search Spiner

[チュートリアル](https://remix.run/docs/en/main/start/tutorial#adding-search-spinner)に従い検索窓にスピナーを追加します。

GETのフォーム送信の場合、`formData`は空になり、`navigation.location.search`にデータが反映されます。

（参考）[navigation.formData](https://remix.run/docs/en/main/hooks/use-navigation#navigationformdata)

```
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );
```

検索窓に入力し結果取得できるまでの間、`navigation.state`は`loading`となっているため、コンタクトカード表示領域がローディング表示になってしまっている。この対策のために`searching`を使う。

```
        <div
          className={
            navigation.state === "loading" && !searching
              ? "loading"
              : ""
          }
          id="detail"
        >
```

## Managing the History Stack

検索窓でキー入力するたびに履歴に登録されるので、[チュートリアル](https://remix.run/docs/en/main/start/tutorial#managing-the-history-stack)に従い必要以上に履歴が登録されるのを停止します。


