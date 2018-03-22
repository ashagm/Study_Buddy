# Study Buddy
### For when you need to study smart, not just hard.

**Study Buddy** is an online application that helps connect people looking for study partners.

## Frontend Technologies used:

*  HTML
*  CSS
*  Javascript
*  JQuery
*  Bootstrap
*  AJAX
*  Handlebars

## Backend Technologies Used:

*  mySQL
*  Node.js
*  Express.js
*  Sequelize
*  Many other npms (*all of which can be found in the package.json*)

-----------------------------

## User Walkthrough

When the application is first brought up, you are able to either sign in, or create an account with the sign up button.

Once the user is logged in they are able to see all of the available *study groups* that others have created. They have the option of clicking a group to **read more** about it, **searching** for a group they are interested in, or they can **make** their own group.

### Clicking to read more about a group:
This will bring the user to the individual group page, where they have the option to join the group. 

If they join, the rest of page will appear, which will reveal the group chat that is available, all the group members and if they are currently online or not, and the time and location that the study group will mee up.

The user also hase the option to leave the group.

### Making their own group

If the user would like to make their own study group, they can simply click on the create group form and fill it out. 

When the user makes their own group they become the admin of that group, where they have more options available to them.
 
  *  They can update the time and location of the study group.
  *  They can choose to delete the group if they wish.

---------
## The user is also able to: 

* View thier own profile, which will show thier info and the groups they are in.
* View all of the groups they are admin of.

____________ 
### Development
The database is made up of 5 tables associated through sequelize. The data is also pulled from the database with sequelize, utilizing Handlebars to template the HTML. A comnination of Bootstrap and custom CSS was used for styling.

This website can be run on a node server with mySQL, or it can be found [here](heroku link here).

------------

**Frontend Developers:**

[Yongok Kim](https://github.com/KayKim106)

[Mariuxi Vasconez](https://github.com/Mariuxiv08)

**Backend Developers:**

[Asha](https://github.com/ashagm)

[Cole Santiago](https://github.com/ColeSantiago)