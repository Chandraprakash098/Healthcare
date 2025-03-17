import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/tasks/taskSlice';

function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const dispatch = useDispatch();

  const onChange = (e) => {
    setEditFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(updateTask({
      id: task._id,
      taskData: editFormData,
    }));

    setIsEditing(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'todo':
        return 'badge-todo';
      case 'in-progress':
        return 'badge-progress';
      case 'completed':
        return 'badge-completed';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className='task'>
      {isEditing ? (
        <form onSubmit={onSubmit} className='edit-form'>
          <div className='form-group'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              value={editFormData.title}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='description'>Description</label>
            <textarea
              name='description'
              id='description'
              value={editFormData.description}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='status'>Status</label>
            <select
              name='status'
              id='status'
              value={editFormData.status}
              onChange={onChange}
            >
              <option value='todo'>To Do</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
          <div className='form-actions'>
            <button type='submit' className='btn btn-save'>
              Save
            </button>
            <button
              type='button'
              className='btn btn-cancel'
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className='task-header'>
            <h2>{task.title}</h2>
            <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>
          <p className='task-description'>{task.description}</p>
          <div className='task-footer'>
            <div className='task-actions'>
              <button 
                onClick={() => setIsEditing(true)} 
                className='btn edit-btn'
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(deleteTask(task._id))}
                className='btn delete-btn'
              >
                Delete
              </button>
            </div>
            <p className='date'>
              Created: {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;