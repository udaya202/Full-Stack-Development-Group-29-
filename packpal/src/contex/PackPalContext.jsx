import { createContext, useContext, useState, useEffect } from 'react';
import { initialLists, initialTasks } from '../data/mockData';

const PackPalContext = createContext();

export function PackPalProvider({ children }) {
    const [lists, setLists] = useState(() => {
        try {
            const saved = localStorage.getItem('packpal_lists_v2');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Error reading lists from localStorage:", e);
        }
        return initialLists;
    });

    const [tasks, setTasks] = useState(() => {
        try {
            const saved = localStorage.getItem('packpal_tasks_v2');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Error reading tasks from localStorage:", e);
        }
        return initialTasks;
    });

    // Save to localStorage on state changes
    useEffect(() => {
        try {
            localStorage.setItem('packpal_lists_v2', JSON.stringify(lists));
        } catch (e) {
            console.error("Error saving lists to localStorage:", e);
        }
    }, [lists]);

    useEffect(() => {
        try {
            localStorage.setItem('packpal_tasks_v2', JSON.stringify(tasks));
        } catch (e) {
            console.error("Error saving tasks to localStorage:", e);
        }
    }, [tasks]);

    // Calculate live progress and stats for lists
    const enrichedLists = lists.map(list => {
        const listTasks = tasks.filter(t => t.listId === list.id || (t.purpose && t.purpose.toLowerCase() === list.name.toLowerCase()));
        const totalItems = listTasks.length;
        const completedItems = listTasks.filter(t => t.status === 'packed' || t.completed).length;
        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        return {
            ...list,
            totalItems,
            completedItems,
            progress,
        };
    });

    // Compute overall global stats
    const totalLists = enrichedLists.length;
    const totalItems = tasks.length;
    const completedItems = tasks.filter(t => t.status === 'packed' || t.completed).length;
    
    // Unique assignees across tasks
    const assigneesSet = new Set(tasks.map(t => t.assignee).filter(Boolean));
    const collaboratorsCount = Math.max(assigneesSet.size, 4);

    const stats = {
        totalLists,
        totalItems,
        completedItems,
        collaborators: collaboratorsCount,
    };

    // Actions
    const addList = (newListData) => {
        let topColor = 'bg-blue-500';
        let progressBarColor = 'bg-blue-500';

        if (newListData.color === 'bg-amber-400') {
            topColor = 'bg-amber-400';
            progressBarColor = 'bg-amber-400';
        } else if (newListData.color === 'bg-emerald-400') {
            topColor = 'bg-emerald-400';
            progressBarColor = 'bg-emerald-400';
        } else if (newListData.color === 'bg-purple-500') {
            topColor = 'bg-purple-500';
            progressBarColor = 'bg-purple-500';
        } else if (newListData.color === 'bg-rose-500') {
            topColor = 'bg-rose-500';
            progressBarColor = 'bg-rose-500';
        }

        const newList = {
            id: Date.now(),
            name: newListData.name.trim(),
            image: null,
            icon: newListData.type === 'Shopping' ? 'fa-shopping-bag' : 'fa-suitcase',
            topColor,
            progressBarColor,
            updated: 'Just now',
            owner: 'Senithu',
            members: [
                { id: 1, name: 'Senithu', initials: 'S', bg: 'bg-blue-500 text-white' }
            ],
            ...newListData,
        };

        setLists(prev => [newList, ...prev]);
        return newList;
    };

    const deleteList = (listId) => {
        const targetList = lists.find(l => l.id === listId);
        setLists(prev => prev.filter(l => l.id !== listId));
        if (targetList) {
            setTasks(prev => prev.filter(t => t.listId !== listId && t.purpose?.toLowerCase() !== targetList.name.toLowerCase()));
        }
    };

    const addTask = (newTaskData) => {
        let targetListId = newTaskData.listId;
        let targetPurpose = newTaskData.purpose;

        if (!targetListId && targetPurpose) {
            const found = lists.find(l => l.name.toLowerCase() === targetPurpose.toLowerCase());
            if (found) {
                targetListId = found.id;
            }
        }

        if (targetListId && !targetPurpose) {
            const found = lists.find(l => l.id === Number(targetListId));
            if (found) {
                targetPurpose = found.name;
            }
        }

        const newTask = {
            id: Date.now(),
            listId: Number(targetListId) || (lists[0] ? lists[0].id : 1),
            title: newTaskData.title.trim(),
            purpose: targetPurpose || (lists.find(l => l.id === Number(targetListId))?.name || 'Japan Trip Packing'),
            description: newTaskData.description ? newTaskData.description.trim() : 'No description provided.',
            status: newTaskData.status || 'to-pack',
            completed: (newTaskData.status === 'packed'),
            category: newTaskData.category || 'Documents',
            priority: newTaskData.priority || 'Medium',
            assignee: newTaskData.assignee || 'Senithu',
            quantity: Number(newTaskData.quantity) || 1,
            dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
            addedBy: 'Senithu',
            addedAt: 'Just now',
        };

        setTasks(prev => [newTask, ...prev]);
        return newTask;
    };

    const updateTask = (taskId, updatedFields) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const merged = { ...task, ...updatedFields };
                if (updatedFields.status !== undefined) {
                    merged.completed = (updatedFields.status === 'packed');
                } else if (updatedFields.completed !== undefined) {
                    merged.status = updatedFields.completed ? 'packed' : 'to-pack';
                }
                return merged;
            }
            return task;
        }));
    };

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const toggleTaskStatus = (taskId) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const isDone = task.status === 'packed' || task.completed;
                const newStatus = isDone ? 'to-pack' : 'packed';
                return {
                    ...task,
                    status: newStatus,
                    completed: !isDone
                };
            }
            return task;
        }));
    };

    const resetData = () => {
        localStorage.removeItem('packpal_lists_v2');
        localStorage.removeItem('packpal_tasks_v2');
        setLists(initialLists);
        setTasks(initialTasks);
    };

    return (
        <PackPalContext.Provider value={{
            lists: enrichedLists,
            tasks,
            stats,
            addList,
            deleteList,
            addTask,
            updateTask,
            deleteTask,
            toggleTaskStatus,
            resetData,
        }}>
            {children}
        </PackPalContext.Provider>
    );
}

export function usePackPal() {
    const context = useContext(PackPalContext);
    if (!context) {
        throw new Error('usePackPal must be used within a PackPalProvider');
    }
    return context;
}
