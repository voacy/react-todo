import { useContext } from "react";
import SearchTaskForm from "../SearchTaskForm/SearchTaskForm";
import TodoInfo from "../TodoInfo/TodoInfo";
import TodoList from "../TodoList/TodoList";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import { TasksContext } from "../../context/TasksContext";
import Button from "../Button/Button";
import styles from "./Todo.module.scss";

const Todo = () => {
	const { firstIncompleteTaskRef, tasks } = useContext(TasksContext);
	return (
		<div className={styles.todo}>
			<h1 className={styles.title}>To Do List</h1>
			<AddTaskForm styles={styles} />
			<SearchTaskForm styles={styles} />
			<TodoInfo styles={styles} />
			{tasks.length > 0 && (
				<Button
					onClick={() =>
						firstIncompleteTaskRef.current?.scrollIntoView({
							behavior: "smooth",
						})
					}
				>
					Show first incomplete task
				</Button>
			)}
			<TodoList styles={styles} />
		</div>
	);
};

export default Todo;
