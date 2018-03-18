'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('groups', [{
        group_name: 'javascript',
        group_desc: 'Study group for javascript'
      }], {});
    
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group', null, {});    
  }
};
