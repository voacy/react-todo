import { useEffect, useState } from "react";
import tasksAPI from "@/shared/api/tasks";

const TaskPage = (props) => {
	const { params } = props;
	const taskId = params.id;

	const [task, setTask] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const fetchTask = async () => {
			setIsLoading(true);
			setHasError(false);
			try {
				const taskData = await tasksAPI.getById(taskId);
				setTask(taskData);
			} catch {
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTask();
	}, [taskId]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (hasError) {
		return <div>Task not found!</div>;
	}

	return (
		<h1>
			{task.title}
			<p>{task.isDone ? "Task completed!" : "Task not completed!"}</p>
		</h1>
	);
};

export default TaskPage;
