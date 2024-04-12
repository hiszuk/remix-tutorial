# Remix Tutorial Advanced hands-on

Remix Tutorial の Advanced hands-on として以下の内容に挑戦します。

1. ~~storybookを導入してコンポーネントのstoryを作る~~
2. storybookのplay機能を使ってinteraction testを書く
3. storybookのテストランナーでコマンドラインからテストを起動する
4. chromaticを設定してビジュアル・リグレッション・テストの環境を作る

# 2. storybookのplay機能を使ってinteraction testを書く②

## Contactのストーリーブック作成

`app/routes/contacts.$contactId/contact.stories.tsx`を作成していきます。

```
import type { Meta, StoryObj } from '@storybook/react';

import Contact from './route';

const meta: Meta<typeof Contact> = {
  title: 'Contact',
  component: Contact,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Contact>;

export const Default: Story = {};
```

`process is not defined`というエラーが出るので、`vite-sb.config.ts`に設定を追加します。

```
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  return {
    plugins: [tsconfigPaths()],
    define: {
      'process.env': {},
    },
  };
});
```

以下のようなエラーが表示されます。

```
Error: useLoaderData must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.
```

これは`Remix`の`loader`関数や`action`関数をうまく起動できていないために発生しています。

エラーを解消するためにRemixのスタブを導入します。

## createRemixStubの導入

[Remixコンポーネントをテストする方法](https://zenn.dev/kyrice2525/articles/article_tech_019)の内容を参考にします。

```
npm install --save-dev @remix-run/testing
```

stubを使いカードを表示できるようにします。

この際、本当の`loader`関数と`action`関数もimportすることで、処理の動作も確認することができます。

```
import type { Meta, StoryObj } from '@storybook/react';
import { createRemixStub } from '@remix-run/testing';

import Contact, {loader, action} from './route';

const meta: Meta<typeof Contact> = {
  title: 'Contact',
  component: Contact,
  decorators: [
    (story) => {
      const remixStub = createRemixStub([
        {
          // 通常のコンタクトカード表示処理
          path: "/contacts/:contactId",
          action, // お気に入りON/OFFのアクションを設定
          loader, // contactIdのデータを取得するローダーを設定
          Component: () => story(), // Contactを指定
        }
      ]);
      return remixStub({
        // 表示する人のIDを指定する
        initialEntries: ['/contacts/alex-anderson'],
      })
    }
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Contact>;

export const Default: Story = {};
```

![コンタクトカード](docs/images/advanced-05.png)

コンタクトカードのデータを読み込み表示することができました！

## interaction testを書く

### カードにデータが表示されること

```
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('コンタクトカードが正しく表示されていること', async () => {
      expect(await canvas.findByText('Alex Anderson')).toBeInTheDocument();
      expect(canvas.getByText('@ralex1993')).toBeInTheDocument();
      expect((canvas.getByRole('link')).outerHTML).toEqual('<a href="https://twitter.com/@ralex1993">@ralex1993</a>')
      const buttons = canvas.getAllByRole('button');
      expect(buttons.length).toEqual(3);
      expect(buttons[0].textContent).toEqual('☆');
      expect(buttons[1].textContent).toEqual('Edit');
      expect(buttons[2].textContent).toEqual('Delete');
      const img = canvas.getByRole('img');
      expect(img.getAttribute('src')).toEqual('https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg');
    });
  }
};
```

