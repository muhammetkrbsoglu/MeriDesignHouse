import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrimaryButton } from "@repo/ui";

const meta = {
  title: "Pilot/PrimaryButton",
  component: PrimaryButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Primary Button",
    className: undefined,
  },
};

export const Hover: Story = {
  args: {
    children: "Hover State",
    className: undefined,
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const Active: Story = {
  args: {
    children: "Active State",
    className: undefined,
  },
  parameters: {
    pseudo: { active: true },
  },
};



