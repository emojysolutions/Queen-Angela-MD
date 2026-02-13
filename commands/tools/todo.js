module.exports = {
  name: 'todo',
  aliases: ['task', 'tasks', 'todolist'],
  category: 'Tools',
  description: 'Manage your todo list',
  usage: '!todo <add|list|done|clear> [task]',
  examples: ['!todo add Buy groceries', '!todo list', '!todo done 1', '!todo clear'],
  cooldown: 2,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sessionManager }) => {
    if (!args || args.length === 0) {
      return '📝 *Todo List*\n\n*Commands:*\n• !todo add <task> - Add a task\n• !todo list - View tasks\n• !todo done <number> - Mark task as done\n• !todo clear - Clear all tasks';
    }
    
    const action = args[0].toLowerCase();
    const todos = sessionManager.get(from, 'todos') || [];
    
    if (action === 'add') {
      if (args.length < 2) {
        return '❌ Please specify a task!\n\nExample: !todo add Buy milk';
      }
      
      const task = args.slice(1).join(' ');
      todos.push({ task, done: false, created: Date.now() });
      sessionManager.set(from, 'todos', todos, 86400); // 24 hours TTL
      
      return `✅ Task added!\n\n*Task #${todos.length}:* ${task}\n\nTotal tasks: ${todos.length}`;
    }
    
    if (action === 'list') {
      if (todos.length === 0) {
        return '📝 Your todo list is empty!\n\nUse !todo add <task> to add tasks.';
      }
      
      let response = '📝 *Your Todo List*\n\n';
      todos.forEach((todo, index) => {
        const status = todo.done ? '✅' : '⬜';
        const taskText = todo.done ? `~${todo.task}~` : todo.task;
        response += `${status} ${index + 1}. ${taskText}\n`;
      });
      
      const pendingCount = todos.filter(t => !t.done).length;
      response += `\n_${pendingCount} task(s) remaining_`;
      
      return response;
    }
    
    if (action === 'done') {
      if (args.length < 2) {
        return '❌ Please specify task number!\n\nExample: !todo done 1';
      }
      
      const taskNum = parseInt(args[1]);
      
      if (isNaN(taskNum) || taskNum < 1 || taskNum > todos.length) {
        return `❌ Invalid task number! You have ${todos.length} task(s).`;
      }
      
      const task = todos[taskNum - 1];
      task.done = true;
      sessionManager.set(from, 'todos', todos, 86400);
      
      return `✅ Task completed!\n\n*Task #${taskNum}:* ~${task.task}~`;
    }
    
    if (action === 'clear') {
      const count = todos.length;
      sessionManager.delete(from, 'todos');
      return `🗑️ Cleared ${count} task(s) from your todo list.`;
    }
    
    return '❌ Invalid action!\n\nValid actions: add, list, done, clear';
  }
};
