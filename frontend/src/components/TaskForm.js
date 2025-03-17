import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';

function TaskForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
  });

  const { title, description, status } = formData;

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createTask(formData));
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'todo',
    });
  };

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Task Title</label>
          <input
            type='text'
            name='title'
            id='title'
            value={title}
            onChange={onChange}
            placeholder='Enter task title'
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Task Description</label>
          <textarea
            name='description'
            id='description'
            value={description}
            onChange={onChange}
            placeholder='Enter task description'
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='status'>Status</label>
          <select
            name='status'
            id='status'
            value={status}
            onChange={onChange}
          >
            <option value='todo'>To Do</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;