'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('groups', [{
        group_name: 'Javascript',
        group_desc: 'Study group for Javascript'
      }], {});
    
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group', null, {});    
  }
};
