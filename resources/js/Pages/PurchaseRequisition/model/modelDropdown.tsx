export const modelDropdowns = [
  {
    dropdown: 'document_type',
    struct: {
      name: 'purchasing_dsc',
      id: 'purchasing_doc',
      tabel: 'document_types',
      hiddenZero: true,
      isMapping: true,
    },
  },
  {
    dropdown: 'user_id',
    struct: {
      name: 'username',
      id: 'id',
      tabel: 'users',
      where: {
        isNotNull: true,
        key: 'master_business_partner_id',
      },
    },
  },
  {
    dropdown: 'purchasing_groups',
    struct: {
      name: 'purchasing_group_desc',
      id: 'purchasing_group',
      tabel: 'purchasing_groups',
      hiddenZero: true,
      isMapping: true,
    },
  },
  {
    dropdown: 'storage_locations',
    struct: {
      name: 'storage_location_desc',
      id: 'storage_location',
      tabel: 'storage_locations',
      hiddenZero: true,
      isMapping: true,
    },
  },
];
