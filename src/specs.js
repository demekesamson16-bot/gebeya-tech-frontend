// =====================================================
// GEBEYA TECH — product spec definitions
// This file defines what fields each category has.
// =====================================================

export const CATEGORY_SPECS = {
  phones: {
    label: 'Phone',
    fields: [
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        options: [
          'Apple', 'Samsung', 'Tecno', 'Xiaomi', 'Huawei',
          'Oppo', 'Infinix', 'Nokia', 'Realme', 'OnePlus', 'Other',
        ],
      },
      {
        key: 'model',
        label: 'Model',
        type: 'text',
        placeholder: 'e.g. iPhone 13 Pro',
      },
      {
        key: 'storage',
        label: 'Storage',
        type: 'select',
        options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
      },
      {
        key: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'],
      },
      {
        key: 'battery_mah',
        label: 'Battery capacity (mAh)',
        type: 'text',
        placeholder: 'e.g. 3240',
      },
      {
        key: 'battery_health',
        label: 'Battery health (%)',
        type: 'text',
        placeholder: 'e.g. 92 (used only)',
      },
      {
        key: 'screen_inches',
        label: 'Screen size (inches)',
        type: 'text',
        placeholder: 'e.g. 6.1',
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'e.g. Midnight Black',
      },
      {
        key: 'condition',
        label: 'Condition',
        type: 'select',
        options: [
          'Brand New',
          'Open Box',
          'Used – Like New',
          'Used – Good',
          'Used – Fair',
        ],
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'e.g. Addis Ababa · Bole',
      },
    ],
  },

  laptops: {
    label: 'Laptop',
    fields: [
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        options: [
          'Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer',
          'MSI', 'Samsung', 'Toshiba', 'Microsoft', 'Other',
        ],
      },
      {
        key: 'model',
        label: 'Model',
        type: 'text',
        placeholder: 'e.g. MacBook Air M2',
      },
      {
        key: 'processor',
        label: 'Processor',
        type: 'text',
        placeholder: 'e.g. Apple M2, Intel i5 12th gen',
      },
      {
        key: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['4GB', '8GB', '16GB', '32GB', '64GB'],
      },
      {
        key: 'storage',
        label: 'Storage',
        type: 'select',
        options: ['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '500GB HDD', '1TB HDD'],
      },
      {
        key: 'screen_inches',
        label: 'Screen size (inches)',
        type: 'text',
        placeholder: 'e.g. 13.6',
      },
      {
        key: 'condition',
        label: 'Condition',
        type: 'select',
        options: [
          'Brand New',
          'Open Box',
          'Used – Like New',
          'Used – Good',
          'Used – Fair',
        ],
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'e.g. Addis Ababa · Bole',
      },
    ],
  },

  tablets: {
    label: 'Tablet',
    fields: [
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        options: ['Apple', 'Samsung', 'Lenovo', 'Huawei', 'Xiaomi', 'Other'],
      },
      {
        key: 'model',
        label: 'Model',
        type: 'text',
        placeholder: 'e.g. iPad Air 5',
      },
      {
        key: 'storage',
        label: 'Storage',
        type: 'select',
        options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
      },
      {
        key: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'],
      },
      {
        key: 'screen_inches',
        label: 'Screen size (inches)',
        type: 'text',
        placeholder: 'e.g. 10.9',
      },
      {
        key: 'condition',
        label: 'Condition',
        type: 'select',
        options: ['Brand New', 'Open Box', 'Used – Like New', 'Used – Good', 'Used – Fair'],
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'e.g. Addis Ababa · Bole',
      },
    ],
  },

  accessories: {
    label: 'Accessory',
    fields: [
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        options: [
          'Apple', 'Samsung', 'Anker', 'JBL', 'Sony', 'Logitech',
          'Baseus', 'Xiaomi', 'Generic', 'Other',
        ],
      },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          'Charger', 'Cable', 'Case / Cover', 'Screen protector',
          'Headphones', 'Earbuds', 'Speaker', 'Power bank',
          'Mouse', 'Keyboard', 'Watch', 'Other',
        ],
      },
      {
        key: 'condition',
        label: 'Condition',
        type: 'select',
        options: ['Brand New', 'Open Box', 'Used – Like New', 'Used – Good', 'Used – Fair'],
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'e.g. Addis Ababa · Bole',
      },
    ],
  },
};

export function getSpecsForCategory(slug) {
  return CATEGORY_SPECS[slug] || CATEGORY_SPECS.phones;
}

export function getSpecLabel(slug, key) {
  const fields = getSpecsForCategory(slug).fields;
  const f = fields.find((x) => x.key === key);
  return f ? f.label : key;
}
