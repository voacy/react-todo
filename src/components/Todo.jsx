import { useContext } from "react";
import SearchTaskForm from "./SearchTaskForm";
import TodoInfo from "./TodoInfo";
import TodoList from "./TodoList";
import AddTaskForm from "./AddTaskForm";
import Button from "./Button";
import { TasksContext } from "../context/TasksContext";

const Todo = () => {
	const { firstIncompleteTaskRef, tasks } = useContext(TasksContext);
	return (
		<div className="todo">
			<h1 className="todo__title">To Do List</h1>
			<AddTaskForm />
			<SearchTaskForm />
			<TodoInfo />
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
			<TodoList />
		</div>
	);
};

export default Todo;
