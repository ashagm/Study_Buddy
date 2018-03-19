'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('groups', [{
        group_name: 'splatoon',
        group_desc: 'Study group for splatoon'
      }], {});
    
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group', null, {});    
  }
};
