import type { Meta, StoryObj } from '@storybook/react';
import { createRemixStub } from '@remix-run/testing';
import { expect, within } from '@storybook/test';

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

