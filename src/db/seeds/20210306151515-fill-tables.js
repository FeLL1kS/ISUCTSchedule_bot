'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'universities',
      [
        {
          id: 1,
          name: 'ИГХТУ',
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      'sources',
      [
        {
          id: 1,
          name: 'telegram',
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('universities', null, {});
    await queryInterface.bulkDelete('sources', null, {});
  },
};
