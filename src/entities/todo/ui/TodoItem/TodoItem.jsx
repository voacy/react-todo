import { memo, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TasksContext } from "@/entities/todo/";
import RouterLink from "@/shared/ui/RouterLink";
import styles from "./TodoItem.module.scss";
import { highlightCaseInsensitive } from "@/shared/utils/highlight";

const TodoItem = (props) => {
	const { className = "", id, title, isDone } = props;

	const {
		deleteTask,
		toggleTaskComplete,
		firstIncompleteTaskId,
		firstIncompleteTaskRef,
		disappearingTaskId,
		appearingTaskId,
		searchQuery,
	} = useContext(TasksContext);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const highlightedTitle = highlightCaseInsensitive(title, searchQuery);

	const isDisappearing = disappearingTaskId === id;
	const isSomeoneDisappearing = disappearingTaskId !== null;

	const dndStyle = {
		transform: CSS.Transform.toString(transform),
		transition: isSomeoneDisappearing ? undefined : transition,
	};

	return (
		<li
			ref={(node) => {
				setNodeRef(node);
				if (id === firstIncompleteTaskId && firstIncompleteTaskRef) {
					firstIncompleteTaskRef.current = node;
				}
			}}
			style={dndStyle}
			data-done={isDone}
			className={`${styles.todoItem} ${className} ${isDisappearing ? styles.isDisappearing : ""} ${appearingTaskId === id ? styles.isAppearing : ""} ${isDragging ? styles.isDragging : ""}`}
		>
			<button
				className={styles.dragHandle}
				aria-label="Drag to reorder"
				{...attributes}
				{...listeners}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="5.5" cy="4" r="1.5" fill="currentColor"/>
					<circle cx="5.5" cy="8" r="1.5" fill="currentColor"/>
					<circle cx="5.5" cy="12" r="1.5" fill="currentColor"/>
					<circle cx="10.5" cy="4" r="1.5" fill="currentColor"/>
					<circle cx="10.5" cy="8" r="1.5" fill="currentColor"/>
					<circle cx="10.5" cy="12" r="1.5" fill="currentColor"/>
				</svg>
			</button>
			<input
				className={styles.checkbox}
				id={id}
				type="checkbox"
				checked={isDone}
				onChange={(e) => toggleTaskComplete(id, e.target.checked)}
			/>
			<label className={`${styles.label} visually-hidden`} htmlFor={id}>
				{title}
			</label>
			<RouterLink to={`tasks/${id}`} aria-label="Task detail page">
				<span dangerouslySetInnerHTML={{ __html: highlightedTitle }}></span>
			</RouterLink>
			<button
				className={styles.deleteButton}
				aria-label="Delete"
				title="Delete"
				onClick={() => deleteTask(id)}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15 5L5 15M5 5L15 15"
						stroke="#757575"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</li>
	);
};

export default memo(TodoItem);
