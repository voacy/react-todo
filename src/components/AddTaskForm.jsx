import Field from "./Field";
import Button from "./Button";
import { useContext } from "react";
import { TasksContext } from "../context/TasksContext";

const AddTaskForm = () => {
	const { addTask, newTaskTitle, setNewTaskTitle, newTaskInputRef } =
		useContext(TasksContext);

	const onSubmit = (event) => {
		event.preventDefault();
		addTask();
	};

	return (
		<form className="todo__form" onSubmit={onSubmit}>
			<Field
				className="todo__field"
				label="New task title"
				id="new-task"
				value={newTaskTitle}
				onInput={(event) => setNewTaskTitle(event.target.value)}
				ref={newTaskInputRef}
			/>
			<Button isDisabled={newTaskTitle.trim().length === 0} type="Submit">
				Add
			</Button>
		</form>
	);
};

export default AddTaskForm;
