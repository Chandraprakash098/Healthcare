import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Spinner from '../components/Spinner';
import { getTasks, reset } from '../features/tasks/taskSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTasks());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>Tasks Dashboard</p>
      </section>

      <TaskForm />

      <section className='content'>
        <div className='filter-controls'>
          <button 
            className={`btn ${filter === 'all' ? 'btn-active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'todo' ? 'btn-active' : ''}`} 
            onClick={() => setFilter('todo')}
          >
            To Do
          </button>
          <button 
            className={`btn ${filter === 'in-progress' ? 'btn-active' : ''}`} 
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`btn ${filter === 'completed' ? 'btn-active' : ''}`} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {filteredTasks.length > 0 ? (
          <div className='tasks'>
            {filteredTasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <h3>You have not set any tasks</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;