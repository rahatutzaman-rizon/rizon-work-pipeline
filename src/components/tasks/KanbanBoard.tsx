'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '@/lib/store/task-store';

interface KanbanBoardProps {
  tasks: Task[];
}

const COLUMNS: Array<{ id: TaskStatus; title: string; accentColor: string }> = [
  { id: 'todo', title: 'To Do', accentColor: '#6366f1' }, // Indigo
  { id: 'in_progress', title: 'In Progress', accentColor: '#06b6d4' }, // Cyan
  { id: 'review', title: 'Review', accentColor: '#f59e0b' }, // Amber
  { id: 'done', title: 'Completed', accentColor: '#10b981' }, // Emerald
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const { moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px move to initiate drag, preventing accidental triggers on clicks!
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask) return;

    // Check if dropped directly over a column ID
    let targetStatus: TaskStatus | null = null;
    if (['todo', 'in_progress', 'review', 'done'].includes(overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      // Dropped over another task card inside a column
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus && draggedTask.status !== targetStatus) {
      moveTask(draggedTask.id, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-start overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-0 flex-1 snap-center">
              <KanbanColumn
                id={col.id}
                title={col.title}
                tasks={colTasks}
                accentColor={col.accentColor}
              />
            </div>
          );
        })}
      </div>

      {/* Smooth Drag Overlay */}
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
};
