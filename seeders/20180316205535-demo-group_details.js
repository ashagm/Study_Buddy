'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('group_details', [{
        group_id: 1,
        grp_date_time: 'June, 1st, 2018',
        grp_location: 'school'
      }], {});
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group_detail', null, {});
  }
};
