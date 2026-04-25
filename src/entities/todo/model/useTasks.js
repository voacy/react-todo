import {
	useState,
	useRef,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";
import tasksAPI from "@/shared/api/tasks";

const ORDER_STORAGE_KEY = "tasks-order";

const saveOrder = (tasks) => {
	localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(tasks.map((t) => t.id)));
};

const applyOrder = (tasks) => {
	try {
		const order = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
		if (!order.length) return tasks;
		const map = Object.fromEntries(tasks.map((t) => [t.id, t]));
		const sorted = order.filter((id) => map[id]).map((id) => map[id]);
		const rest = tasks.filter((t) => !order.includes(t.id));
		return [...sorted, ...rest];
	} catch {
		return tasks;
	}
};

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
		case "REORDER": {
			return arrayMove(state, action.oldIndex, action.newIndex);
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
		localStorage.removeItem(ORDER_STORAGE_KEY);
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

	const reorderTasks = useCallback((oldIndex, newIndex) => {
		dispatch({ type: "REORDER", oldIndex, newIndex });
	}, []);

	useEffect(() => {
		newTaskInputRef.current.focus();
		const loadTasks = async () => {
			const data = await tasksAPI.getAll();
			dispatch({ type: "SET_ALL", tasks: applyOrder(data) });
		};
		loadTasks();
	}, []);

	useEffect(() => {
		if (tasks.length > 0) saveOrder(tasks);
	}, [tasks]);

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
		reorderTasks,
	};
};

export default useTasks;
