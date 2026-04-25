import { memo, useMemo, useContext } from "react";
import { TasksContext } from "@/entities/todo";
import styles from "./TodoInfo.module.scss";

const TodoInfo = () => {
	const { tasks, deleteAllTasks } = useContext(TasksContext);

	const total = tasks.length;
	const hasTasks = total > 0;

	const done = useMemo(() => {
		return tasks.filter(({ isDone }) => isDone).length;
	}, [tasks]);

	const progress = total > 0 ? Math.round((done / total) * 100) : 0;
	const isAllDone = total > 0 && done === total;

	return (
		<div className={styles.info}>
			<div className={styles.top}>
				<span className={`${styles.label} ${isAllDone ? styles.labelDone : ""}`}>
					{isAllDone ? "All done! 🎉" : (
						<>
							<span className={styles.done}>{done}</span>
							<span className={styles.separator}>/</span>
							<span className={styles.total}>{total}</span>
							<span className={styles.text}>completed</span>
						</>
					)}
				</span>
				{hasTasks && (
					<button
						className={styles.deleteAllButton}
						type="button"
						onClick={deleteAllTasks}
					>
						Delete all
					</button>
				)}
			</div>
			{hasTasks && (
				<div className={styles.progressBar}>
					<div
						className={`${styles.progressFill} ${isAllDone ? styles.progressFillDone : ""}`}
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}
		</div>
	);
};

export default memo(TodoInfo);
