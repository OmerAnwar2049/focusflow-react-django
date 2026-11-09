# FocusFlow — React + Django Task Tracker

A beginner-friendly full-stack project with a polished dashboard. Add tasks, mark them complete, filter the list, and delete tasks. The React frontend talks to a Django REST API, and Django stores tasks in SQLite.

## Tech stack
- **Frontend:** React, Vite, plain CSS
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite (created automatically by Django)

## Features
- Create, complete, and delete tasks
- Filter by all / active / completed
- Dashboard counts and completion progress
- Responsive layout
- REST API with Django admin support

## Project structure
```text
focusflow/
├── backend/
│   ├── config/
│   ├── tasks/
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── index.html
    └── package.json
```

## 1. Run the backend

Use Python 3.10+.

```bash
cd backend
python -m venv .venv
```

Activate the environment:

- Windows PowerShell: `.venv\Scripts\Activate.ps1`
- macOS/Linux: `source .venv/bin/activate`

Install dependencies and start Django:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/tasks/`.
Django admin is at `http://127.0.0.1:8000/admin/`.

## 2. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks/` | List tasks |
| POST | `/api/tasks/` | Create a task |
| PATCH | `/api/tasks/<id>/` | Update task fields |
| DELETE | `/api/tasks/<id>/` | Delete a task |

Example POST body:
```json
{
  "title": "Finish portfolio README",
  "description": "Add setup instructions and screenshots",
  "priority": "medium"
}
```

## Push it to GitHub

Create an empty repository on GitHub, then from this project folder run:

```bash
git init
git add .
git commit -m "Build FocusFlow React and Django task tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/focusflow.git
git push -u origin main
```

Replace the remote URL with your own repository URL.

