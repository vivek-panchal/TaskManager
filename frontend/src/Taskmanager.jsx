import { useEffect, useState } from 'react';
import { FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import { notify } from './utils';

function TaskManager() {
    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [copyTasks, setCopyTasks] = useState([]);
    const [updateTask, setUpdateTask] = useState(null);

    const handleTask = () => {
        if (updateTask && input) {
            const obj = {
                taskName: input,
                isDone: updateTask.isDone,
                _id: updateTask._id
            }
            handleUpdateItem(obj);
        } else if (updateTask === null && input) {
            handleAddTask();
        }
        setInput('');
    }

    useEffect(() => {
        if (updateTask) {
            setInput(updateTask.taskName);
        }
    }, [updateTask]);

    const handleAddTask = async () => {
        const obj = {
            taskName: input,
            isDone: false
        }
        try {
            const { success, message } = await CreateTask(obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error');
        }
    }

    const fetchAllTasks = async () => {
        try {
            const { data } = await GetAllTasks();
            setTasks(data);
            setCopyTasks(data);
        } catch (err) {
            console.error(err);
            notify('Failed to fetch tasks', 'error');
        }
    }

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const handleDeleteTask = async (id) => {
        try {
            const { success, message } = await DeleteTaskById(id);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to delete task', 'error');
        }
    }

    const handleCheckAndUncheck = async (item) => {
        const { _id, isDone, taskName } = item;
        const obj = {
            taskName,
            isDone: !isDone
        }
        try {
            const { success, message } = await UpdateTaskById(_id, obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to update task', 'error');
        }
    }

    const handleUpdateItem = async (item) => {
        const { _id, isDone, taskName } = item;
        const obj = {
            taskName,
            isDone: isDone
        }
        try {
            const { success, message } = await UpdateTaskById(_id, obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to update task', 'error');
        }
    }

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const oldTasks = [...copyTasks];
        const results = oldTasks.filter((item) => item.taskName.toLowerCase().includes(term));
        setTasks(results);
    }

    return (
        <div className='flex flex-col items-center w-2/3 mx-auto mt-10 bg-gray-900 text-white p-8 rounded-lg'>
            <h1 className='mb-6 text-3xl font-bold'>Task Manager App</h1>
            <div className='flex flex-wrap justify-between items-center mb-6 w-full'>
                <div className='flex w-full mb-4 lg:mb-0 lg:w-2/3'>
                    <input type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className='flex-grow px-4 py-2  border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400'
                        placeholder='Add a new Task'
                    />
                    <button
                        onClick={handleTask}
                        className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mx-3'
                    >
                        <FaPlus />
                    </button>
                </div>

                <div className='flex w-full lg:w-1/3'>
                    <span className='flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg'>
                        <FaSearch />
                    </span>
                    <input
                        onChange={handleSearch}
                        className='flex-grow px-4 py-2 border border-gray-700 rounded-r-lg bg-gray-800 text-white placeholder-gray-400'
                        type='text'
                        placeholder='Search tasks'
                    />
                </div>
            </div>

            <div className='flex flex-col w-full'>
                {
                    tasks?.map((item) => (
                        <div key={item._id} className='m-2 p-4 bg-gray-800 border border-gray-700 rounded-lg flex justify-between items-center'>
                            <span className={item.isDone ? 'line-through' : ''}>{item.taskName}</span>
                            <div className='flex'>
                                <button
                                    onClick={() => handleCheckAndUncheck(item)}
                                    className='px-2 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mr-2'
                                    type='button'>
                                    <FaCheck />
                                </button>
                                <button
                                    onClick={() => setUpdateTask(item)}
                                    className='px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2'
                                    type='button'>
                                    <FaPencilAlt />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(item._id)}
                                    className='px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700'
                                    type='button'>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default TaskManager;
