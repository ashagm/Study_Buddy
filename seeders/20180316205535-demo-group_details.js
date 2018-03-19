'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('group_details', [{

      }], {});
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group_detail', null, {});
  }
};
