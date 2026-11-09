import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Check, CheckCircle2, Circle, ClipboardList, Plus, Sparkles, Trash2 } from "lucide-react";

const API = "http://127.0.0.1:8000/api/tasks/";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load tasks.");
      setTasks(await response.json());
      setError("");
    } catch {
      setError("Can't reach Django yet. Start the backend, then refresh this page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), priority })
      });
      if (!response.ok) throw new Error("Task could not be created.");
      const created = await response.json();
      setTasks(current => [created, ...current]);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setError("");
    } catch {
      setError("Couldn't save that task. Check that the Django server is running.");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}${task.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!response.ok) throw new Error();
      const updated = await response.json();
      setTasks(current => current.map(item => item.id === task.id ? updated : item));
    } catch {
      setError("Couldn't update the task. Please try again.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setTasks(current => current.filter(task => task.id !== id));
    } catch {
      setError("Couldn't delete the task. Please try again.");
    }
  }

  const completed = tasks.filter(task => task.completed).length;
  const active = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><Activity size={20} /></span> focusflow</a>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item selected"><ClipboardList size={18} /> My tasks <span>{active}</span></div>
        <div className="side-note">
          <div className="note-icon"><Sparkles size={17} /></div>
          <strong>A little progress<br />goes a long way.</strong>
          <p>Keep your focus on what matters today.</p>
        </div>
        <div className="sidebar-footer"><span className="status-dot" /> Your personal space</div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>My tasks</strong></div>
          <div className="avatar">Y</div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR DAILY OVERVIEW</div>
              <h1>Make room for <em>great work.</em></h1>
              <p className="subtitle">A clear mind starts with a clear plan. What's on your list?</p>
            </div>
            <div className="date-chip"><span className="date-dot" /> TODAY <span className="date-divider">·</span> YOUR PLAN</div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-top"><span>Total tasks</span><ClipboardList size={17} /></div><div className="stat-number">{tasks.length}</div><div className="stat-caption">Things on your plate</div></div>
            <div className="stat-card"><div className="stat-top"><span>In progress</span><Activity size={17} /></div><div className="stat-number">{active}</div><div className="stat-caption">One step at a time</div></div>
            <div className="stat-card"><div className="stat-top"><span>Completed</span><CheckCircle2 size={17} /></div><div className="stat-number">{completed}</div><div className="stat-caption">Look at you go!</div></div>
            <div className="progress-card"><div className="progress-head"><span>Daily progress</span><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p>{completed === 0 ? "Your next win is waiting." : completed === tasks.length ? "Everything is checked off. Amazing!" : "You're building momentum. Keep going!"}</p><div className="progress-decoration"><Sparkles size={15} /></div></div>
          </div>

          <div className="workspace-grid">
            <section className="tasks-panel">
              <div className="panel-heading">
                <div><h2>Your tasks</h2><p>Small steps, meaningful progress.</p></div>
                <div className="filter-tabs">
                  {["all", "active", "completed"].map(item => <button key={item} className={filter === item ? "filter active-filter" : "filter"} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
                </div>
              </div>
              <div className="task-list">
                {loading ? <div className="empty-state">Loading your tasks…</div> :
                  visibleTasks.length === 0 ? <div className="empty-state"><div className="empty-icon"><CheckCircle2 size={24} /></div><strong>{filter === "all" ? "A fresh start." : `No ${filter} tasks.`}</strong><span>{filter === "all" ? "Add your first task using the form." : "Try another filter or add a new task."}</span></div> :
                  visibleTasks.map(task => <article className={`task-row ${task.completed ? "is-complete" : ""}`} key={task.id}>
                    <button className="check-button" onClick={() => toggleTask(task)} aria-label={task.completed ? "Mark as active" : "Mark as completed"}>{task.completed ? <Check size={15} /> : <Circle size={19} />}</button>
                    <div className="task-copy"><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}<span className={`priority ${task.priority}`}>{task.priority} priority</span></div>
                    <button className="delete-button" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={16} /></button>
                  </article>)
                }
              </div>
              <div className="list-footer"><span>Showing {visibleTasks.length} of {tasks.length} tasks</span><span><span className="tiny-dot" /> Synced with Django</span></div>
            </section>

            <aside className="add-panel">
              <div className="add-heading"><div className="add-icon"><Plus size={18} /></div><div><h2>Add a task</h2><p>Get it out of your head.</p></div></div>
              <form onSubmit={addTask}>
                <label htmlFor="task-title">TASK NAME</label>
                <input id="task-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Build my portfolio" maxLength={120} required />
                <label htmlFor="task-description">A LITTLE DETAIL <span>OPTIONAL</span></label>
                <textarea id="task-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this involve?" rows={4} />
                <label htmlFor="task-priority">PRIORITY</label>
                <select id="task-priority" value={priority} onChange={e => setPriority(e.target.value)}><option value="low">Low — whenever</option><option value="medium">Medium — important</option><option value="high">High — focus first</option></select>
                <button className="submit-button" type="submit">Add to my list <ArrowUpRight size={17} /></button>
              </form>
              <div className="tip"><Sparkles size={15} /><span><strong>Focus tip</strong> — Break big goals into smaller tasks. It makes starting easier.</span></div>
            </aside>
          </div>
          <footer className="page-footer">MADE FOR YOUR NEXT BIG THING <span>✳</span> REACT + DJANGO</footer>
        </div>
      </section>
    </main>
  );
}
