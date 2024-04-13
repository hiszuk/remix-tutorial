# Remix Tutorial Advanced hands-on

Remix Tutorial の Advanced hands-on として以下の内容に挑戦します。

1. ~~storybookを導入してコンポーネントのstoryを作る~~
2. storybookのplay機能を使ってinteraction testを書く
3. storybookのテストランナーでコマンドラインからテストを起動する
4. chromaticを設定してビジュアル・リグレッション・テストの環境を作る

# 2. storybookのplay機能を使ってinteraction testを書く③

## Contactのボタン動作のテストを書く

### お気に入りボタンON/OFF

`ContactButton`という名前でストーリーを追加し、お気に入りボタンのON/OFFの動作確認をします。

```
/**
 * お気にりボタン、Editボタン、Deleteボタン押下時の動きをテスト
 */
export const ContactButton: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // レンダリングが完了するまで待つ
    await waitFor(() => {
      expect(canvas.getAllByRole('button').length).toBe(3)
    }, { timeout: 5000 });

    await step('お気に入りボタンON/OFF確認', async () => {
      // お気に入りボタン要素の取得
      const star = canvas.getAllByRole('button')
        .find((el) => el.getAttribute('name') === 'favorite') as HTMLElement;
      
      // お気に入りボタンが取得できるか
      expect(star).toBeInTheDocument();

      // お気に入りボタンの初期値が"☆"か?
      expect(star.textContent).toEqual('☆');

      // お気に入りボタン押下
      await userEvent.click(star);

      // お気に入りボタンが"★"に変わるか?
      expect(star.textContent).toEqual('★');

      // お気に入りボタン押下
      await userEvent.click(star);

      // お気に入りボタンが"☆"に変わるか?
      expect(star.textContent).toEqual('☆');
    });
  },
};
```

### ダミーページとルートの追加

`Edit`, `Delete`ボタン押下時の動作確認のため、`<Edit />`と`<Destroy />`のダミーコンポーネントを定義し、RemixStubのルーティングに`/contacts/:contactId/edit`と`/contacts/:contactId/destoroy`のパスを追加します。

```
// import ブロック

const Edit = () => <div>Edit Page</div>
const Destroy = () => <div>Destroy Page</div>

// const meta ...
```

下記のようにルートを追加する

```
  decorators: [
    (story) => {
      const remixStub = createRemixStub([
        {
          // 通常のコンタクトカード表示処理
          path: "/contacts/:contactId",
          action, // お気に入りON/OFFのアクションを設定
          loader, // contactIdのデータを取得するローダーを設定
          Component: () => story(), // Contactを指定
        },
        {
          // Editボタン押下時のルート
          path: '/contacts/:contactId/edit',
          action: () => ({ redirect: '/' }), // ダミー
          loader: () => ({ redirect: '/' }), // ダミー
          Component: () => <Edit />,
        },
        {
          // Deleteボタン押下時のルート
          path: '/contacts/:contactId/destroy',
          action: () => ({ redirect: '/' }), // ダミー
          Component: () => <Destroy />,
        }
      ]);
      return remixStub({
        // 表示する人のIDを指定する
        initialEntries: ['/contacts/alex-anderson'],
      })
    }
  ],
```

動作確認のために、`Edit`と`Delete`を押下し期待通りのダミーページに遷移することを確認する。

### `Edit`押下後の動きの確認

```
/**
 * Editボタン押下時の動きをテスト
 */
export const EditButton: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // レンダリングが完了するまで待つ
    await waitFor(() => {
      expect(canvas.getAllByRole('button').length).toBe(3)
    }, { timeout: 5000 });

    // Editボタン要素の取得
    const edit = canvas.getAllByRole('button')
      .find((el) => el.textContent === 'Edit') as HTMLElement;

    await step('Editボタンを押下するとEdit Pageに遷移すること', async () => {
      // Editボタンをクリックする
      await userEvent.click(edit);

      // Edit Pageに遷移する
      expect(await canvas.findByText('Edit Page')).toBeInTheDocument();
    })
  },
}
```

### `Delete`押下後の動きの確認

`Delete`押下後にwindow.confirmがコールされているため制御ができなくなる。そこで、wndow.confirmをモックし、1回目は`Cancel`、2回目は`OK`を押したように振る舞うよう設定する。

```
/**
 * Deleteボタン押下時の動きをテスト
 */
export const DeleteButton: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // window.confirmをモックする
    const spy = spyOn(window, 'confirm')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementationOnce((_msg) => {
        // まずCancelをクリック
        return false
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementationOnce((_msg) => {
        // 次にOKをクリック
        return true
      })

    // レンダリングが完了するまで待つ
    await waitFor(() => {
      expect(canvas.getAllByRole('button').length).toBe(3)
    }, { timeout: 5000 });

    // Deleteボタン要素の取得
    const button = canvas.getAllByRole('button')
      .find((el) => el.textContent === 'Delete') as HTMLElement;

    // Cancelの場合
    await step('Confirmをキャンセルした場合は元のページに留まること', async () => {
      // Deleteボタンをクリックする
      await userEvent.click(button);

      // Confirmダイアログが開く
      await expect(spy).toHaveBeenCalledWith('Please confirm you want to delete this record.');

      // 元のページにとどまる
      expect(await canvas.findByText('Alex Anderson')).toBeInTheDocument();
    })

    // OKの場合
    await step('ConfirmをOKした場合はDestroyページに遷移すること', async () => {
      // Deleteボタンをクリックする
      await userEvent.click(button);

      // Confirmダイアログが開く
      await expect(spy).toHaveBeenCalledWith('Please confirm you want to delete this record.');

      // 元のページにとどまる
      expect(await canvas.findByText('Destroy Page')).toBeInTheDocument();
    })
  },
}
```
