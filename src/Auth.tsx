import { FormEvent, useEffect, useState } from 'react';
import { remult } from 'remult';
import App from './App';

export default function Auth() {
	const [username, setUsername] = useState('');
	const [signedIn, setSignedIn] = useState(false);

	async function doSignIn(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const result = await fetch('api/signIn', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username }),
		});

		if (result.ok) {
			remult.user = await result.json();
			setSignedIn(true);
			setUsername('');
		} else {
			alert(await result.json());
		}
	}

	async function signOut() {
		await fetch('/api/signOut', { method: 'POST' });
		setSignedIn(false);
		remult.user = undefined;
	}

	useEffect(() => {
		fetch('/api/currentUser').then(async (result) => {
			remult.user = await result.json();
			if (remult.user) setSignedIn(true);
		});
	}, []);

	if (!signedIn) {
		return (
			<>
				<h1>Todos</h1>
				<main>
					<form onSubmit={(e) => doSignIn(e)}>
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Username, try Steve or Jane'
						></input>
						<button>Sign In</button>
					</form>
				</main>
			</>
		);
	}
	return (
		<>
			<header>
				Hello {remult.user!.name}{' '}
				<button onClick={() => signOut()}>Sign Out</button>
			</header>
			<App />
		</>
	);
}
