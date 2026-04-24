const URL = "http://localhost:3001/tasks/";

const headers = {
	"Content-Type": "application/json",
};

const serverAPI = {
	getAll: async () => {
		const res = await fetch(URL);
		return await res.json();
	},

	getById: async (id) => {
		const res = await fetch(`${URL}${id}`);
		return res.json();
	},

	add: async (task) => {
		const res = await fetch(URL, {
			method: "POST",
			headers,
			body: JSON.stringify(task),
		});
		return await res.json();
	},

	delete: async (id) => {
		return await fetch(`${URL}${id}`, {
			method: "DELETE",
		});
	},

	deleteAll: async (tasks) => {
		return await Promise.all(
			tasks.map(({ id }) => {
				return serverAPI.delete(id);
			}),
		);
	},

	toggleComplete: async (id, isDone) => {
		return await fetch(`${URL}${id}`, {
			method: "PATCH",
			headers,
			body: JSON.stringify({ isDone }),
		});
	},
};

export default serverAPI;
