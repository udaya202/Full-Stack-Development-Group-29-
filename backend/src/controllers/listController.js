import { getDb, saveDb } from '../db/db.js';

export const getLists = (req, res) => {
  try {
    const db = getDb();
    // Return all lists (or user filtered lists)
    const userLists = db.lists.filter(l => !l.userId || l.userId === req.user.id || l.owner === req.user.name);
    res.status(200).json(userLists.length > 0 ? userLists : db.lists);
  } catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ error: 'Internal server error while fetching lists.' });
  }
};

export const getListById = (req, res) => {
  try {
    const db = getDb();
    const listId = Number(req.params.id);
    const list = db.lists.find(l => l.id === listId);

    if (!list) {
      return res.status(404).json({ error: 'List not found.' });
    }

    res.status(200).json(list);
  } catch (err) {
    console.error('Error fetching list by id:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createList = (req, res) => {
  try {
    const { name, color, type, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'List name is required.' });
    }

    let topColor = 'bg-blue-500';
    let progressBarColor = 'bg-blue-500';

    if (color === 'bg-amber-400') {
      topColor = 'bg-amber-400';
      progressBarColor = 'bg-amber-400';
    } else if (color === 'bg-emerald-400') {
      topColor = 'bg-emerald-400';
      progressBarColor = 'bg-emerald-400';
    } else if (color === 'bg-purple-500') {
      topColor = 'bg-purple-500';
      progressBarColor = 'bg-purple-500';
    } else if (color === 'bg-rose-500') {
      topColor = 'bg-rose-500';
      progressBarColor = 'bg-rose-500';
    }

    const newList = {
      id: Date.now(),
      userId: req.user.id,
      name: name.trim(),
      image: null,
      icon: icon || (type === 'Shopping' ? 'fa-shopping-bag' : 'fa-suitcase'),
      topColor,
      progressBarColor,
      updated: 'Just now',
      owner: req.user.name || 'Senithu',
      members: [
        { id: req.user.id, name: req.user.name || 'Senithu', initials: (req.user.name || 'S').charAt(0), bg: 'bg-blue-500 text-white' }
      ]
    };

    const db = getDb();
    db.lists.unshift(newList);
    saveDb(db);

    res.status(201).json(newList);
  } catch (err) {
    console.error('Error creating list:', err);
    res.status(500).json({ error: 'Internal server error while creating list.' });
  }
};

export const updateList = (req, res) => {
  try {
    const listId = Number(req.params.id);
    const db = getDb();
    const index = db.lists.findIndex(l => l.id === listId);

    if (index === -1) {
      return res.status(404).json({ error: 'List not found.' });
    }

    const updatedList = {
      ...db.lists[index],
      ...req.body,
      updated: 'Just now'
    };

    db.lists[index] = updatedList;
    saveDb(db);

    res.status(200).json(updatedList);
  } catch (err) {
    console.error('Error updating list:', err);
    res.status(500).json({ error: 'Internal server error while updating list.' });
  }
};

export const deleteList = (req, res) => {
  try {
    const listId = Number(req.params.id);
    const db = getDb();
    const targetList = db.lists.find(l => l.id === listId);

    if (!targetList) {
      return res.status(404).json({ error: 'List not found.' });
    }

    db.lists = db.lists.filter(l => l.id !== listId);
    // Delete associated tasks
    db.tasks = db.tasks.filter(t => t.listId !== listId && t.purpose?.toLowerCase() !== targetList.name.toLowerCase());

    saveDb(db);

    res.status(200).json({ message: 'List deleted successfully', id: listId });
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ error: 'Internal server error while deleting list.' });
  }
};
