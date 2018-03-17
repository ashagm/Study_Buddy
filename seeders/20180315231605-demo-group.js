'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('groups', [{
        group_name: 'html',
        group_desc: 'Study group for html'
      }], {});
    
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group', null, {});    
  }
};
