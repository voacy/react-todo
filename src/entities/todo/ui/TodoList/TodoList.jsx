import { memo, useContext } from "react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoItem, TasksContext } from "@/entities/todo/";

const TodoList = (props) => {
	const { styles } = props;
	const { tasks, filteredTasks, reorderTasks } = useContext(TasksContext);

	const hasTasks = tasks.length > 0;
	const isEmptyFilteredTasks = filteredTasks?.length === 0;

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
	);

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return;

		const activeIndex = tasks.findIndex((t) => t.id === active.id);
		const overIndex = tasks.findIndex((t) => t.id === over.id);
		reorderTasks(activeIndex, overIndex);
	};

	if (!hasTasks) {
		return <div className={styles.emptyMessage}>There are no tasks yet</div>;
	}

	if (hasTasks && isEmptyFilteredTasks) {
		return <div className={styles.emptyMessage}>Tasks not found</div>;
	}

	const displayedTasks = filteredTasks ?? tasks;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={displayedTasks.map((t) => t.id)}
				strategy={verticalListSortingStrategy}
			>
				<ul className={styles.list}>
					{displayedTasks.map((task) => (
						<TodoItem className={styles.item} key={task.id} {...task} />
					))}
				</ul>
			</SortableContext>
		</DndContext>
	);
};

export default memo(TodoList);
