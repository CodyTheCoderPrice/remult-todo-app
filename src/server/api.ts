import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/task';
import { TasksController } from '../shared/TasksController';
import { createPostgresConnection } from 'remult/postgres';

export const api = remultExpress({
	entities: [Task],
	controllers: [TasksController],
	getUser: (req) => req.session!['user'],
	dataProvider: createPostgresConnection({
		connectionString:
			'postgres://postgres:PostgresEasyPassword@localhost:5432/remulttodo',
	}),
});
