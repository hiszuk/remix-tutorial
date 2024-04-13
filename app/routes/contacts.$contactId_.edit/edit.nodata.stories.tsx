import type { Meta, StoryObj } from '@storybook/react';
import { createRemixStub } from '@remix-run/testing';
import { expect, waitFor, within } from '@storybook/test';

import EditContact, { loader } from './route';

const meta: Meta<typeof EditContact> = {
  title: 'EditContact',
  component: EditContact,
  decorators: [
    (story) => {
      const remixStub = createRemixStub([
        {
          // Editボタン押下時のルート
          path: '/contacts/:contactId/edit',
          action: () => ({ redirect: '/' }),
          loader, // 編集対象の読み込み
          Component: () => story(),
        },
      ]);
      return remixStub({
        // 表示する人のIDを指定する
        initialEntries: ['/contacts/no-user/edit'],
      })
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditContact>;

/**
 * <h3>テストシナリオ</h3>
 * <p>
 * DBに存在しないIDを指定してエラーとなることを確認する
 * </p>
 */
export const NoData: Story = {
  play: async({ canvasElement }) => {
    const canvas = within(canvasElement);

    // レンダリングが完了するまで待つ
    await waitFor(() => {
      expect(canvas.getByRole('heading', { name: '404' })).toBeInTheDocument();
    }, { timeout: 5000 });
  }
};
