'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('groups', [{
        group_name: 'video games',
        group_desc: 'Study group for video games'
      }], {});
    
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('group', null, {});    
  }
};
