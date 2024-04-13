import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';

import Index from './route';

const meta: Meta<typeof Index> = {
  title: 'index',
  component: Index,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Index>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('the docs at remix.run リンクが表示されること', async () => {
      const element = canvas.getByRole('link');
      expect(element.textContent).toEqual('the docs at remix.run');
      expect(element.outerHTML).toEqual('<a href="https://remix.run">the docs at remix.run</a>')
    })
  }
};
