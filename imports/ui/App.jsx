import React from 'react';
import { Task } from  './Task.jsx'
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';

const tasks = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];

const toggleChecked = ({ _id, isChecked}) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
};

const deleteTask = ({_id}) => TasksCollection.remove(_id);

export const App = () => {

  const tasks = useTracker(() => TasksCollection.find({}, {sort: {createdAt: -1}}).fetch());
  return(
    <div>
      <div>
       <h1>Welcome to Meteor!</h1>
  
       <TaskForm/>
        <ul>
         { tasks.map(task => <Task 
         key={ task._id } 
         task={ task }
          onCheckboxClick={toggleChecked}
          onDeleteClick={deleteTask}/>) }
         </ul>
      </div>
    
    </div>
  )
 
};
