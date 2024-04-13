import type { Meta, StoryObj } from '@storybook/react';
import { createRemixStub } from '@remix-run/testing';
import { expect, spyOn, userEvent, waitFor, within } from '@storybook/test';

import Contact, { loader, action } from './route';

const Edit = () => <div>Edit Page</div>
const Destroy = () => <div>Destroy Page</div>

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
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Contact>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // レンダリングが完了するまで待つ
    await waitFor(() => {
      expect(canvas.getAllByRole('button').length).toBe(3)
    }, { timeout: 5000 });

    await step('コンタクトカードが正しく表示されていること', async () => {
      expect(canvas.getByText('Alex Anderson')).toBeInTheDocument();
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

/**
 * お気にりボタン押下時の動きをテスト
 */
export const FavoriteButton: Story = {
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
