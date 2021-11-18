import React, {useState} from 'react';
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

  //const tasks = useTracker(() => TasksCollection.find({}, {sort: {createdAt: -1}}).fetch());
  const[hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = {isChecked: {$ne:true}};

  const pendingTasksCount = useTracker (() =>
    TasksCollection.find(hideCompletedFilter).count()
  );

  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : '' 
  }`;

  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1},
    }).fetch()
  );

  return(
    <div className="app">
      
        <header>
          <div className="app-bar">
            <div className="app-header">
             <h1>📝️ To Do List
               {pendingTasksTitle}
             </h1>
            </div>
          </div>
       
       </header>
       <div className="main">
       <TaskForm/>
       <div className="filter">
         <button onClick={()=> setHideCompleted(!hideCompleted)}>
           {hideCompleted ? 'Show All' : 'Hide Completed'}
         </button>
       </div>
        <ul className="tasks">
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
