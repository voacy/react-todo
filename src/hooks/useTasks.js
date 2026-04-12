import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import tasksAPI from "../api/tasksAPI";

const useTasks = () => {
	const [tasks, setTasks] = useState([]);

	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [disappearingTaskId, setDisappearingTaskId] = useState(null);
	const [appearingTaskId, setAppearingTaskId] = useState(null);

	const newTaskInputRef = useRef(null);

	const addTask = useCallback(async (title) => {
		const newTask = {
			title,
			isDone: false,
		};

		const data = await tasksAPI.add(newTask);
		setTasks((prevTasks) => [...prevTasks, data]);
		setNewTaskTitle("");
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
		setTasks([]);
	}, [tasks]);

	const deleteTask = useCallback(async (taskId) => {
		tasksAPI.delete(taskId);
		setDisappearingTaskId(taskId);
		setTimeout(() => {
			setTasks((prevTasks) =>
				prevTasks.filter((task) => task.id !== taskId),
			);
			setDisappearingTaskId(null);
		}, 400);
	}, []);

	const toggleTaskComplete = useCallback(async (taskId, isDone) => {
		tasksAPI.toggleComplete(taskId, isDone);

		setTasks((prevTasks) =>
			prevTasks.map((task) => {
				if (task.id === taskId) {
					return { ...task, isDone };
				}
				return task;
			}),
		);
	}, []);

	useEffect(() => {
		newTaskInputRef.current.focus();
		const loadTasks = async () => {
			const data = await tasksAPI.getAll();
			setTasks(data);
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
		newTaskTitle,
		setNewTaskTitle,
		searchQuery,
		setSearchQuery,
		newTaskInputRef,
		addTask,
		disappearingTaskId,
		appearingTaskId,
	};
};

export default useTasks;
