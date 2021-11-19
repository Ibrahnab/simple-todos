import React, {useState, Fragment} from 'react';
import { Task } from  './Task.jsx'
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm'
import { Meteor } from 'meteor/meteor';


const tasks = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];

const toggleChecked = ({ _id, isChecked}) => {
  // TasksCollection.update(_id, {
  //   $set: {
  //     isChecked: !isChecked
  //   }
  // })
  Meteor.call('tasks.setIsChecked', _id, !isChecked);
};

const deleteTask = ({_id}) => Meteor.call('tasks.remove', _id);

export const App = () => {

  //const tasks = useTracker(() => TasksCollection.find({}, {sort: {createdAt: -1}}).fetch());
  const[hideCompleted, setHideCompleted] = useState(false);
 
  const user = useTracker(() => Meteor.user());
  const userFilter = user ? { userId: user._id} : {};
 
  const hideCompletedFilter = {isChecked: {$ne:true}};
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter};

  // const pendingTasksCount = useTracker (() =>
  //   TasksCollection.find(hideCompletedFilter).count()
  // );



  // const tasks = useTracker(() =>
  //   TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
  //     sort: { createdAt: -1},
  //   }).fetch()
  // );
  // const tasks = useTracker(() => {
  //   if (!user) {
  //     return [];
  //   }

  //   return TasksCollection.find(
  //     hideCompleted ? pendingOnlyFilter : userFilter,
  //     {
  //       sort: { createdAt: -1 },
  //     }
  //   ).fetch();
  // });

  // const pendingTasksCount = useTracker(() => {
  //   if (!user) {
  //     return 0;
  //   }

  //   return TasksCollection.find(pendingOnlyFilter).count();
  // });

  const { tasks, pendingTasksCount, isLoading} = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0};
    if(!Meteor.user()){
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('tasks');

    if(!handler.ready()) { 
      return { ...noDataAvailable, isLoading: true};
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter, 
      {
        sort: {createdAt: -1},
      }
    ).fetch();
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return {tasks, pendingTasksCount};
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : '' 
  }`;

  const logout = () => Meteor.logout();

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
         {user ? (
           <Fragment>
             <div className="user" onClick={logout}>
               {user.username}
             </div>
            <TaskForm user={user}/>
            <div className="filter">
              <button onClick={()=> setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            {isLoading && <div className="loading">loading...</div>}

            <ul className="tasks">
              { tasks.map(task => <Task 
                key={ task._id } 
                task={ task }
                onCheckboxClick={toggleChecked}
                onDeleteClick={deleteTask}/>) }
              </ul>
              </Fragment>
         ) : (<LoginForm />)}
       </div>
    
    </div>
  )
 
};
