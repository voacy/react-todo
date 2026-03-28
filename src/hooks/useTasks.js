import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import useTasksLocalStorage from "./useTasksLocalStorage";

const useTasks = () => {
	const { savedTasks, saveTasks } = useTasksLocalStorage();
	const [tasks, setTasks] = useState(savedTasks ?? []);

	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const newTaskInputRef = useRef(null);

	const addTask = useCallback(() => {
		if (newTaskTitle.trim().length > 0) {
			const newTask = {
				id: crypto?.randomUUID() ?? Date.now().toString(),
				title: newTaskTitle,
				isDone: false,
			};
			setTasks((prevTasks) => [...prevTasks, newTask]);
			setNewTaskTitle("");
			setSearchQuery("");
			newTaskInputRef.current.focus();
		}
	}, [newTaskTitle]);

	const deleteAllTasks = useCallback(() => {
		const isConfirmed = confirm("Are you sure you want to delete all tasks?");

		if (isConfirmed) setTasks([]);
	}, []);

	const deleteTask = useCallback((taskId) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
	}, []);

	const toggleTaskComplete = useCallback((taskId, isDone) => {
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
		saveTasks(tasks);
	}, [tasks]);

	useEffect(() => {
		newTaskInputRef.current.focus();
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
	};
};

export default useTasks;
