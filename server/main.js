import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { TasksCollection } from "/imports/api/TasksCollection"
import { useTracker } from 'meteor/react-meteor-data';
import { Accounts} from 'meteor/accounts-base';
import '/imports/api/tasksMethods';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

const insertTask = (taskText,user) => TasksCollection.insert({
   text: taskText,
   userId:user._id,
   createdAt: new Date(), 
  });

Meteor.startup(() => {
  if(!Accounts.findUserByUsername(SEED_USERNAME)){
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(taskText => insertTask(taskText, user));
  }
});
