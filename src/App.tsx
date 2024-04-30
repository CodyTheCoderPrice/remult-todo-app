import { FormEvent, useEffect, useState } from 'react';
import { Task } from './shared/task';
import { remult } from 'remult';

const taskRepo = remult.repo(Task);

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');

	useEffect(() => {
		taskRepo.find().then(setTasks);
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
							<input type='checkbox' checked={task.completed} />
							{task.title}
						</div>
					);
				})}
			</main>
		</div>
	);
}

export default App;
