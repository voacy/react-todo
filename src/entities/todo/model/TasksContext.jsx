import { createContext } from "react";
import useTasks from "./useTasks";
import useIncompleteTaskScroll from "./useIncompleteTaskScroll";
import { useMemo } from "react";

export const TasksContext = createContext({});

export const TasksProvider = (props) => {
	const { children } = props;

	const {
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
	} = useTasks();

	const { firstIncompleteTaskRef, firstIncompleteTaskId } =
		useIncompleteTaskScroll(tasks);

	const value = useMemo(
		() => ({
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
			firstIncompleteTaskRef,
			firstIncompleteTaskId,
			reorderTasks,
		}),
		[
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
			firstIncompleteTaskRef,
			firstIncompleteTaskId,
			reorderTasks,
		],
	);

	return (
		<TasksContext.Provider value={value}>{children}</TasksContext.Provider>
	);
};
