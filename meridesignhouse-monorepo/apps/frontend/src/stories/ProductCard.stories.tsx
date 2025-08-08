import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ProductCard, { Product } from "@repo/ui";

const meta = {
  title: "Pilot/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleProduct: Product = {
  id: "1",
  name: "El Yapımı Seramik Kupa",
  category: "Mutfak",
  price: 349.9,
  imageSrc:
    "https://images.unsplash.com/photo-1616628188460-8e4a054023e3?q=80&w=800&auto=format&fit=crop",
  imageAlt: "El yapımı seramik kupa görseli",
};

export const Default: Story = {
  args: {
    product: exampleProduct,
  },
};

export const Hover: Story = {
  args: {
    product: exampleProduct,
  },
  parameters: {
    pseudo: { hover: true },
  },
};



