import type { Meta, StoryObj } from '@storybook/react';
import { createRemixStub } from '@remix-run/testing';
import { expect, spyOn, userEvent, waitFor, within } from '@storybook/test';

import App, { loader, action } from './root';
import Index from './routes/_index/route';
import Contact, { loader as contactLoader, action as contactAction } from './routes/contacts.$contactId/route';
import EditContact, { loader as editLoader, action as editAction } from './routes/contacts.$contactId_.edit/route';
import { action as deleteAction } from './routes/contacts.$contactId.destroy/route';

const meta: Meta<typeof App> = {
  title: 'RootApp',
  component: App,
  decorators: [
    (story) => {
      const remixStub = createRemixStub([
        {
          path: '/',
          loader,
          Component: () => story(),
          // Outletで読み込むコンポーネント
          // 各モジュールは本物を設定する
          children: [
            {
              path: '/',
              action, // _indexにactionはないが、この位置でないとnewのアクションがうまく動かなかった
              Component: () => <Index />
            },
            {
              path: '/contacts/:contactId',
              loader: contactLoader,
              action: contactAction,
              Component: () => <Contact />
            },
            {
              path: '/contacts/:contactId/edit',
              loader: editLoader,
              action: editAction,
              Component: () => <EditContact />
            },
            {
              path: '/contacts/:contactId/destroy',
              action: deleteAction,
            }
          ]
        },
      ]);
      return remixStub({
        initialEntries: ['/'],
      })
    }
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof App>;

/**
 * <h3>トップ画面の表示</h3>
 * <ul>
 * <li>検索窓が表示されている</li>
 * <li>Newボタンが表示されている</li>
 * <li>サイドバーにリストが31件表示されている</li>
 * <li>詳細欄にindexページが表示されている</li>
 * </ul>
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // データが読み込まれるまで待つ
    await step('データが読み込まれるまで待つ', async () => {
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(32), { timeout: 5000 });
    });

    // 検索窓がある
    await step('検索窓が表示されていること', () => {
      expect(canvas.getByRole('search')).toBeInTheDocument();
      expect(canvas.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    // Newボタンがある
    await step('Newボタンが表示されていること', () => {
      const button = canvas.getAllByRole('button').find((el) => el.textContent === 'New') as HTMLElement;
      expect(button).toBeInTheDocument();
    });

    // サイドバーにコンタクトリストが表示されている
    await step('サイドバーにコンタクトリストが31件表示されていること', () => {
      const buttons = canvas.getAllByRole('link').filter((el) => !el.textContent?.includes('the docs at remix.run'));
      expect(buttons.length).toBe(31);
      expect(buttons[0].textContent).toEqual('Alex Anderson ');
      expect(buttons[30].textContent).toEqual('Shane Walker ');
    });

    // 詳細ページにインデックスページが表示されていること
    await step('詳細ページにインデックスページが表示されていること', () => {
      const link = canvas.getAllByRole('link').find((el) => el.textContent?.includes('the docs at remix.run')) as HTMLElement;
      expect(link).toBeInTheDocument();
    });
  },
};

/**
 * <h3>検索テストシナリオ</h3>
 * <ul>
 * <li>al入力で6件に絞り込まれる</li>
 * <li>alex入力で2件に絞り込まれる</li>
 * <li>clearで31件に戻る</li>
 * </ul>
 */
export const Search: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // データが読み込まれるまで待つ
    await step('データが読み込まれるまで待つ', async () => {
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(32), { timeout: 5000 });
    });

    // al入力で6件に絞り込まれる
    await step('al入力で6件に絞り込まれること', async () => {
      const text = canvas.getByPlaceholderText('Search');
      await userEvent.type(text, 'al');
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(6 + 1), { timeout: 5000 });
    });

    // alex入力で2件に絞り込まれる
    await step('alex入力で2件に絞り込まれること', async () => {
      const text = canvas.getByPlaceholderText('Search');
      await userEvent.type(text, 'ex');
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(2 + 1), { timeout: 5000 });
    });

    // clearで31件に戻る
    await step('clearで31件に戻ること', async () => {
      const text = canvas.getByPlaceholderText('Search');
      await userEvent.clear(text);
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(31 + 1), { timeout: 5000 });
    });
  },
}

/**
 * <h3>コンタクトクリックのテストシナリオ</h3>
 * <ul>
 * <li>Alex Andersonをクリックして詳細エリアにコンタクトカードが表示される</li>
 * <li>Shane Walkerをクリックして詳細エリアにコンタクトカードが表示される</li>
 * </ul>
 */
export const ShowContact: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // データが読み込まれるまで待つ
    await step('データが読み込まれるまで待つ', async () => {
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(32), { timeout: 5000 });
    });

    // Alex Andersonをクリックして詳細エリアにコンタクトカードが表示される
    await step('Alex Andersonをクリックして詳細エリアにコンタクトカードが表示される', async () => {
      const link = canvas.getByRole('link', { name: 'Alex Anderson' });
      userEvent.click(link);
      await waitFor(() => expect(canvas.getByText('Alex Anderson')).toBeInTheDocument(), { timeout: 5000 });
      await waitFor(() => expect(link.getAttribute('class')).toEqual('active'), { timeout: 5000 });
    });

    // Shane Walkerをクリックして詳細エリアにコンタクトカードが表示される
    await step('Shane Walkerをクリックして詳細エリアにコンタクトカードが表示される', async () => {
      const link = canvas.getByRole('link', { name: 'Shane Walker' });
      userEvent.click(link);
      await waitFor(() => expect(canvas.getByText('Shane Walker')).toBeInTheDocument(), { timeout: 5000 });
      await waitFor(() => expect(link.getAttribute('class')).toEqual('active'), { timeout: 5000 });
    });
  },
}

/**
 * <h3>Newコンタクのテストシナリオ</h3>
 * <ul>
 * <li>Newボタンクリックで新規レコードを追加できる</li>
 * <li>追加したコンタクトを表示する</li>
 * <li>追加したコンタクトを削除する</li>
 * </ul>
 */
export const NewContact: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // window.confirmをモックする
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const spy = spyOn(window, 'confirm')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((_msg) => {
        return true
      })

    // データが読み込まれるまで待つ
    await step('データが読み込まれるまで待つ', async () => {
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(32), { timeout: 5000 });
    });

    // Newボタンクリックで新規レコードを追加できる
    await step('Newボタンクリックで新規レコードを追加できる', async () => {
      const button = canvas.getByRole('button', { name: 'New' });
      await userEvent.click(button);
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(32), { timeout: 5000 });
    });

    // 編集画面が表示されるまで待つ
    await step('編集画面が表示されるまで待つ', async () => {
      await waitFor(
        async () => expect((await canvas.findAllByRole('textbox')).length).toBe(5),
        { timeout: 5000 }
      );
     })

     // 編集画面で情報入力し登録でききる
    await step('編集画面で情報入力し登録でききる', async () => {
      const first = canvas.getByRole('textbox', { name: 'First name' });
      const last = canvas.getByRole('textbox', { name: 'Last name' });
      const button = canvas.getByRole('button', { name: 'Save' });
      await userEvent.type(first, 'Jon');
      await userEvent.type(last, 'Doe');
      await userEvent.click(button);

      const link = await canvas.findByRole('link', { name: 'Jon Doe' }, { timeout: 5000 });
      expect(link).toBeInTheDocument();
      await waitFor(() => expect(link.getAttribute('class')).toEqual('active'), { timeout: 5000 });
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Delete' })).toBeInTheDocument() ,{ timeout: 5000 });
    });

    // 追加したコンタクトを削除する
    await step('追加したコンタクトを削除できる', async () => {
      // メニュークリック
      const link = canvas.getByRole('link', { name: 'Jon Doe' });
      await userEvent.click(link);

      // 新規レコードのカード表示を待つ
      await waitFor(
        async () => expect((await canvas.findByRole('button', { name: 'Add to favorites' }))).toBeInTheDocument(),
        { timeout: 5000 }
      );

      // 新規追加レコードを削除する
      const del = await canvas.findByRole('button', { name: 'Delete' });
      await userEvent.click(del);

      // 削除後インデックスが表示されるのを待つ
      await waitFor(() => expect(canvas.getByRole('link', { name: 'the docs at remix.run' })).toBeInTheDocument(), { timeout: 5000 });

      // メニューのリンクが一つ減っていて、削除した名前がない
      await waitFor(() => expect(canvas.getAllByRole('link').length).toBe(32), { timeout: 5000 });
      expect(canvas.queryAllByRole('link').find((el) => el.textContent === 'Jon Doe ')).toBeUndefined();
    });
  },
};
