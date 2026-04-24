import {
	useState,
	useRef,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import tasksAPI from "@/shared/api/tasks";

const tasksReducer = (state, action) => {
	switch (action.type) {
		case "SET_ALL": {
			return Array.isArray(action.tasks) ? action.tasks : state;
		}
		case "ADD": {
			return [...state, action.task];
		}
		case "TOGGLE_COMPLETE": {
			const { id, isDone } = action;
			return state.map((task) => {
				return task.id === id ? { ...task, isDone } : task;
			});
		}
		case "DELETE": {
			return state.filter((task) => task.id !== action.id);
		}
		case "DELETE_ALL": {
			return [];
		}
		default: {
			return state;
		}
	}
};

const useTasks = () => {
	const [tasks, dispatch] = useReducer(tasksReducer, []);
	const [searchQuery, setSearchQuery] = useState("");
	const [disappearingTaskId, setDisappearingTaskId] = useState(null);
	const [appearingTaskId, setAppearingTaskId] = useState(null);

	const newTaskInputRef = useRef(null);

	const addTask = useCallback(async (title, callbackAfterAdding) => {
		const newTask = {
			title,
			isDone: false,
		};

		const data = await tasksAPI.add(newTask);
		dispatch({ type: "ADD", task: data });
		callbackAfterAdding();
		setSearchQuery("");
		newTaskInputRef.current.focus();
		setAppearingTaskId(data.id);
		setTimeout(() => {
			setAppearingTaskId(null);
		}, 400);
	}, []);

	const deleteAllTasks = useCallback(async () => {
		const isConfirmed = confirm("Are you sure you want to delete all tasks?");

		if (!isConfirmed) return;

		tasksAPI.deleteAll(tasks);
		dispatch({ type: "DELETE_ALL" });
	}, [tasks]);

	const deleteTask = useCallback(async (taskId) => {
		tasksAPI.delete(taskId);
		setDisappearingTaskId(taskId);
		setTimeout(() => {
			dispatch({ type: "DELETE", id: taskId });
			setDisappearingTaskId(null);
		}, 400);
	}, []);

	const toggleTaskComplete = useCallback(async (taskId, isDone) => {
		tasksAPI.toggleComplete(taskId, isDone);
		dispatch({ type: "TOGGLE_COMPLETE", id: taskId, isDone });
	}, []);

	useEffect(() => {
		newTaskInputRef.current.focus();
		const loadTasks = async () => {
			const data = await tasksAPI.getAll();
			dispatch({ type: "SET_ALL", tasks: data });
		};
		loadTasks();
	}, []);

	const filteredTasks = useMemo(() => {
		const clearSearchQuery = searchQuery.trim().toLowerCase();
		return clearSearchQuery.length > 0
			? tasks.filter(({ title }) => {
					return title.toLowerCase().includes(clearSearchQuery);
				})
			: null;
	}, [searchQuery, tasks]);

	return {
		tasks,
		filteredTasks,
		deleteAllTasks,
		deleteTask,
		toggleTaskComplete,
		searchQuery,
		setSearchQuery,
		newTaskInputRef,
		addTask,
		disappearingTaskId,
		appearingTaskId,
	};
};

export default useTasks;
