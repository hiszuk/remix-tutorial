import type { Meta, StoryObj } from '@storybook/react';
import { createRemixStub } from '@remix-run/testing';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import EditContact, { loader, action } from './route';
import Contact from '../contacts.$contactId/route';

const meta: Meta<typeof EditContact> = {
  title: 'EditContact',
  component: EditContact,
  decorators: [
    (story) => {
      const remixStub = createRemixStub([
        {
          // 通常のコンタクトカード表示処理
          path: "/contacts/:contactId",
          action, // お気に入りON/OFFのアクションを設定
          loader, // contactIdのデータを取得するローダーを設定
          Component: () => <Contact />, // Contactを指定
        },
        {
          // Editボタン押下時のルート
          path: '/contacts/:contactId/edit',
          action, // save動作
          loader, // 編集対象の読み込み
          Component: () => story(),
        },
      ]);
      return remixStub({
        // 表示する人のIDを指定する
        initialEntries: [
          '/contacts/alex-anderson', // 一つ前の履歴
          '/contacts/alex-anderson/edit', // 最初に表示するURL
        ],
        initialIndex: 1,
      })
    }
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditContact>;

/**
 * <h3>テストシナリオ</h3>
 * <ul>
 * <li>FORMに読み込んだ情報が初期値として表示されていることを確認</li>
 * <li>SaveとCancelのボタンが表示されていることを確認</li>
 * </ul>
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // 編集画面が表示されるまで待つ
    await step('編集画面が表示されるまで待つ', async () => {
      await waitFor(
        async () => expect((await canvas.findAllByRole('textbox')).length).toBe(5),
        { timeout: 5000 }
      );
     })

    await step('FORMに初期値が正しく表示されていること', async () => {
      // 初期表示内容が正しい
      expect(canvas.getByRole('textbox', { name: 'First name' }).getAttribute('value')).toEqual('Alex');
      expect(canvas.getByRole('textbox', { name: 'Last name' }).getAttribute('value')).toEqual('Anderson');
      expect(canvas.getByRole('textbox', { name: 'Twitter' }).getAttribute('value')).toEqual('@ralex1993');
      expect(canvas.getByRole('textbox', { name: 'Avatar URL' }).getAttribute('value')).toEqual('https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg');
      expect(canvas.getByRole('textbox', { name: 'Notes' }).getAttribute('value')).toBeNull();
    });

    await step('ボタンが正しく表示されていること', async () => {
      const buttons = canvas.getAllByRole('button');
      expect(buttons[0].textContent).toEqual('Save');
      expect(buttons[1].textContent).toEqual('Cancel');
    })
  }
};

/**
 * <h3>テストシナリオ</h3>
 * <ul>
 * <li>FORMにJon Doeを入力しCancelボタンをクリック<br />
 * → 元のAlexの情報でコンタクトカードが表示される</li>
 * <li>コンタクトカードでEditボタンをクリックし再度編集画面を表示</li>
 * <li>FORMに再度Jon Doeを入力しSaveボタンをクリック<br />
 * → 入力したJon Doeの内容でコンタクトカードが表示される</li>
 * <li>元に戻すためにコンタクトカード画面でEditをクリックし編集画面を表示</li>
 * <li>FORMに元のAlexの情報を入力してSaveボタンをクリック<br />
 * → 元のAlexの情報でコンタクトカードが表示される</li>
 * </ul>
 */
export const Edit: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // 編集画面が表示されるまで待つ
    await step('編集画面が表示されるまで待つ', async () => {
      await waitFor(
        async () => expect((await canvas.findAllByRole('textbox')).length).toBe(5),
        { timeout: 5000 }
      );
     })
 
    // フォームに入力する
    await step('FORMに入力しJon Doe情報を入力する', async () => {
      // 入力フィールドの取得
      const first = canvas.getByRole('textbox', { name: 'First name' });
      const last = canvas.getByRole('textbox', { name: 'Last name' });
      const twitter = canvas.getByRole('textbox', { name: 'Twitter' });
      const avater = canvas.getByRole('textbox', { name: 'Avatar URL' });
      const notes = canvas.getByRole('textbox', { name: 'Notes' });

      // formに入力
      await userEvent.clear(first);
      await userEvent.type(first, 'Jon');
      await userEvent.clear(last);
      await userEvent.type(last, 'Doe');
      await userEvent.clear(twitter);
      await userEvent.type(twitter, '@jondoe');
      await userEvent.clear(avater);
      await userEvent.type(avater, 'https://i.pravatar.cc/200');
      await userEvent.clear(notes);
      await userEvent.type(notes, 'This is Jon Doe contact');
    });

    // Cancelをクリックする
    await step('Cancelをクリックする', async () => {
      // Cancelボタンを取得する
      const cancel = canvas.getByRole('button', { name: 'Cancel' });
      expect(cancel).toBeInTheDocument();
      await userEvent.click(cancel);
    })

    // 画面がカードに切り替わり入力内容が反映されずに元の内容が表示されていることを確認する
    await step('入力内容が反映されず元の内容が表示されていること', async () => {
      // 画面がカード画面に切り替わるのを待つ
      await waitFor(() => expect(canvas.getByText('Alex Anderson')).toBeInTheDocument(), { timeout: 5000 });

      // 入力内容が反映されていること
      expect(canvas.getByText('@ralex1993')).toBeInTheDocument();
      expect((canvas.getByRole('link')).outerHTML).toEqual('<a href="https://twitter.com/@ralex1993">@ralex1993</a>')
      expect(canvas.getByRole('img').getAttribute('src')).toEqual('https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg');
    });

    // Editボタンをクリックして編集画面に遷移する
    await step('Editをクリックし再度編集画面に遷移する', async () => {
      const edit = canvas.getAllByRole('button').find((el) => el.textContent === 'Edit') as HTMLElement;
      expect(edit).toBeInTheDocument();
      await userEvent.click(edit);

      // 編集画面が表示されるまで待つ
      await waitFor(
        async () => expect((await canvas.findAllByRole('textbox')).length).toBe(5),
        { timeout: 5000 }
      );
    });

    // もう一度フォームにJon Doe情報を入力する
    await step('FORMに入力しJon Doe情報を入力する', async () => {
      // 入力フィールドの取得
      const first = canvas.getByRole('textbox', { name: 'First name' });
      const last = canvas.getByRole('textbox', { name: 'Last name' });
      const twitter = canvas.getByRole('textbox', { name: 'Twitter' });
      const avater = canvas.getByRole('textbox', { name: 'Avatar URL' });
      const notes = canvas.getByRole('textbox', { name: 'Notes' });

      // formに入力
      await userEvent.clear(first);
      await userEvent.type(first, 'Jon');
      await userEvent.clear(last);
      await userEvent.type(last, 'Doe');
      await userEvent.clear(twitter);
      await userEvent.type(twitter, '@jondoe');
      await userEvent.clear(avater);
      await userEvent.type(avater, 'https://i.pravatar.cc/200');
      await userEvent.clear(notes);
      await userEvent.type(notes, 'This is Jon Doe contact');
    });

    // Saveをクリックする
    await step('Saveをクリックする', async () => {
      // Saveボタンを取得する
      const save = canvas.getByRole('button', { name: 'Save' });
      expect(save).toBeInTheDocument();
      await userEvent.click(save);
    })

    // 画面がカードに切り替わり入力内容が反映されていることを確認する
    await step('入力内容が反映されていること', async () => {
      // 画面がカード画面に切り替わるのを待つ
      await waitFor(() => expect(canvas.getByText('Jon Doe')).toBeInTheDocument(), { timeout: 5000 });

      // 入力内容が反映されていること
      expect(canvas.getByText('@jondoe')).toBeInTheDocument();
      expect((canvas.getByRole('link')).outerHTML).toEqual('<a href="https://twitter.com/@jondoe">@jondoe</a>');
      expect(canvas.getByText('This is Jon Doe contact')).toBeInTheDocument();
      expect(canvas.getByRole('img').getAttribute('src')).toEqual('https://i.pravatar.cc/200');
    });

    // Editボタンをクリックして編集画面に遷移する
    await step('もう一度Editをクリックし編集画面に遷移する', async () => {
      const edit = canvas.getAllByRole('button').find((el) => el.textContent === 'Edit') as HTMLElement;
      expect(edit).toBeInTheDocument();
      await userEvent.click(edit);

      // 編集画面が表示されるまで待つ
      await waitFor(
        async () => expect((await canvas.findAllByRole('textbox')).length).toBe(5),
        { timeout: 5000 }
      );
    });

    // もう一度フォームにAlex情報を入力する
    await step('FORMに入力しAlex Anderson情報を入力する', async () => {
      // 入力フィールドの取得
      const first = canvas.getByRole('textbox', { name: 'First name' });
      const last = canvas.getByRole('textbox', { name: 'Last name' });
      const twitter = canvas.getByRole('textbox', { name: 'Twitter' });
      const avater = canvas.getByRole('textbox', { name: 'Avatar URL' });
      const notes = canvas.getByRole('textbox', { name: 'Notes' });

      // formに入力
      await userEvent.clear(first);
      await userEvent.type(first, 'Alex');
      await userEvent.clear(last);
      await userEvent.type(last, 'Anderson');
      await userEvent.clear(twitter);
      await userEvent.type(twitter, '@ralex1993');
      await userEvent.clear(avater);
      await userEvent.type(avater, 'https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg');
      await userEvent.clear(notes);
    });

    // Saveをクリックする
    await step('Saveをクリックし元の情報に戻す', async () => {
      // Saveボタンを取得する
      const save = canvas.getByRole('button', { name: 'Save' });
      expect(save).toBeInTheDocument();
      await userEvent.click(save);

      // 画面がカード画面に切り替わるのを待つ
      await waitFor(() => expect(canvas.getByText('Alex Anderson')).toBeInTheDocument(), { timeout: 5000 });
    });
  },
};
