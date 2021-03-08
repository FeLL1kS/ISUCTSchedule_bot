'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const id = {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    };

    await queryInterface.createTable('sources', {
      id,
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
    });

    await queryInterface.createTable('universities', {
      id,
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
    });

    await queryInterface.createTable('faculties', {
      id,
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      universityId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'universities',
          key: 'id',
        },
      },
    });

    await queryInterface.createTable('groups', {
      id,
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      facultyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'faculties',
          key: 'id',
        },
      },
    });

    await queryInterface.createTable('users', {
      id,
      firstname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastname: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lang: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sourceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'sources',
          key: 'id',
        },
      },
      groupId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'groups',
          key: 'id',
        },
      },
      sourceUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('lessons', {
      id,
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'groups',
          key: 'id',
        },
      },
      subject: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      timeStart: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      timeEnd: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      dateStart: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      dateEnd: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      week: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      weekday: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      audiences: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      teachers: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    for (const table of [
      'lessons',
      'users',
      'groups',
      'faculties',
      'universities',
      'sources',
    ]) {
      await queryInterface.dropTable(table);
    }
  },
};
