import { useContext } from "react";
import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task/";
import TodoInfo from "@/features/stats";
import { TodoList } from "@/entities/todo/";
import { TasksContext } from "@/entities/todo";
import Button from "@/shared/ui/Button";
import styles from "./Todo.module.scss";

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return { text: "Good morning", emoji: "🌤️" };
	if (hour < 18) return { text: "Good afternoon", emoji: "☀️" };
	return { text: "Good evening", emoji: "🌙" };
};

const getFormattedDate = () => {
	return new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
};

const Todo = () => {
	const { firstIncompleteTaskRef, tasks } = useContext(TasksContext);
	const greeting = getGreeting();

	return (
		<div className={styles.todo}>
			<div className={styles.header}>
				<div className={styles.headerIcon}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</div>
				<div className={styles.headerText}>
					<h1 className={styles.title}>Today's Tasks</h1>
					<p className={styles.subtitle}>
						{getFormattedDate()} · {greeting.text} {greeting.emoji}
					</p>
				</div>
			</div>
			<AddTaskForm styles={styles} />
			<SearchTaskForm styles={styles} />
			<TodoInfo />
			{tasks.length > 0 && (
				<Button
					variant="secondary"
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
