import { FormEvent, useEffect, useState } from 'react';
import { Task } from './shared/task';
import { remult } from 'remult';
import { TasksController } from './shared/TasksController';

const taskRepo = remult.repo(Task);

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');

	useEffect(() => {
		return taskRepo
			.liveQuery()
			.subscribe((info) => setTasks(info.applyChanges));
	}, []);

	async function addTask(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const newTask = await taskRepo.insert({ title: newTaskTitle });
			setTasks((tasks) => [...tasks, newTask]);
			setNewTaskTitle('');
		} catch (error: any) {
			alert(error.message);
		}
	}

	async function deleteTask(task: Task) {
		try {
			await taskRepo.delete(task);
			setTasks((tasks) => tasks.filter((t) => t !== task));
		} catch (error: any) {
			alert(error.message);
		}
	}

	async function setTask(task: Task, newValue: Task) {
		setTasks((tasks) => tasks.map((t) => (t === task ? newValue : t)));
	}

	async function setCompleted(task: Task, completed: boolean) {
		setTask(task, await taskRepo.save({ ...task, completed }));
	}

	async function setTitle(task: Task, title: string) {
		setTask(task, { ...task, title });
	}

	async function saveTask(task: Task) {
		try {
			setTask(task, await taskRepo.save(task));
		} catch (error: any) {
			alert(error.message);
		}
	}

	async function setAllCompleted(completed: boolean) {
		await TasksController.setAllCompleted(completed);
	}

	return (
		<div>
			<h1>Todos</h1>
			<main>
				<form onSubmit={(e) => addTask(e)}>
					<input
						value={newTaskTitle}
						placeholder='What needs to be done?'
						onChange={(e) => setNewTaskTitle(e.target.value)}
					/>
					<button>Add</button>
				</form>
				{tasks.map((task) => {
					return (
						<div key={task.id}>
							<input
								type='checkbox'
								checked={task.completed}
								onChange={(e) => setCompleted(task, e.target.checked)}
							/>
							<input
								value={task.title}
								onChange={(e) => setTitle(task, e.target.value)}
							/>
							<button onClick={() => saveTask(task)}>Save</button>
							<button onClick={() => deleteTask(task)}>Delete</button>
						</div>
					);
				})}
				<div>
					<button onClick={(e) => setAllCompleted(true)}>
						Set all completed
					</button>
					<button onClick={(e) => setAllCompleted(false)}>
						Set all uncompleted
					</button>
				</div>
			</main>
		</div>
	);
}

export default App;
