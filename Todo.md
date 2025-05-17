# Mini CRM API Todo List

This is a structured todo list for building the Mini CRM API. It outlines core functionality, planned features, and enhancements. This document will be continuously updated as development progresses, including additional features, tests, and documentation.

---

## ✅ General Setup & Quality

- [ ] add eslint
- [x] add prettier
- [x] add .env and environment variable support

---

## 🧑‍💻 Auth

- allowed roles ("user" | "admin")

- **Role: User**

  - [x] user signup `(POST /auth/signup)`

  ```json
  // input payload
  {
    "name": "Ashik Sarkar", // full name
    "email": "ashik@gmail.com", // unique
    "password": "Aa1@ml" // min length 6, 1 uppercase, 1 lowercase, 1 number, 1 special
  }
  ```

  - [x] user signin `(POST /auth/signin)`

  ```json
  // input payload
  {
    "email": "ashik@gmail.com",
    "password": "Aa1@ml"
  }
  ```

  - [x] user signout `(DELETE /auth/signout)` <!-- requires access token -->
  - [x] refresh token `(POST /auth/refresh)` <!-- rend refresh token via cookie -->
  - [x] protect all user routes (middleware)
  - [x] persist session/token securely
  - [x] add password hashing
  - [x] validate input data (Zod)

- **Role: Admin**

  - [x] change user role `(PUT /auth/roles)`

  ```json
  // input payload
  {
    "email": "ashik@gmail.com",
    "role": ["admin"] // allowed roles array
  }
  ```

  - [x] fetch allowed roles `(GET /auth/roles)`

  - [ ] view all users `(GET /auth/users)`

  ```json
  // output payload
  [
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  ]
  ```

  - [ ] view user by id `(GET /auth/users/:userId)`

---

## 👥 Client

- **Role: User**

  - [x] create own client `(POST /clients)`

  ```json
  // input payload
  {
    "name": "Mario R.",
    "email": "amrio@gmail.com",
    "phone": "01234567890",
    "company": "softyMart", // optional
    "notes": "here is a note..." // optional
  }
  ```

  - [ ] update own client `(PATCH /clients/:clientId)`

  ```json
  // input payload
  {
    "name": "Mario S.", // optional
    "phone": "01237567890", // optional
    "company": "xlktc", // optional
    "notes": "here is an updated note..." // optional
  }
  ```

  - [x] delete own client `(DELETE /clients/:clientId)`
  - [x] view own clients `(GET /clients)`
  - [x] view own client detail `(GET /clients/:clientId)`

- **Role: Admin**

  - [ ] view all clients for a user `(GET /clients?userId=...)`
  - [ ] view client detail `(GET /clients/:clientId)`
  - [ ] delete client `(DELETE /clients/:clientId)`

---

## 📁 Project

- allowed project status ("idle" | "in-progress" | "finished") (default "idle")

- **Role: User**

  - [ ] create own project for own client `(POST /clients/:clientId/projects)`

  ```json
  // input payload
  {
    "title": "React Project",
    "budget": 1000, // min $10
    "deadline": "2023-01-01" // (> 2 days from Date.now())
    // "status": "idle" by default
  }
  ```

  - [ ] update own project `(PATCH /projects/:projectId)`

  ```json
  // input payload
  {
    "title": "React Project", // optional
    "budget": 1000, // min $10 // optional
    "deadline": "2023-01-01", // ((>= 2 days from created_at) && (>= Date.now()))
    "status": "finished" // allowed project status // optional
  }
  ```

  - [x] delete own project `(DELETE /projects/:projectId)`
  - [ ] view own projects `(GET /projects)`
  - [ ] view own project detail `(GET /projects/:projectId)`
  - [ ] view own projects by client `(GET /projects?clientId=...)`

- **Role: Admin**

  - [ ] view projects by client `(GET /projects?clientId=...)`
  - [ ] view all projects for a user `(GET /projects?userId=...)`
  - [ ] view project detail `(GET /projects/:projectId)`
  - [ ] delete project `(DELETE /projects/:projectId)`

---

## 📝 Interaction Logs

- [ ] create log for client/project `(POST /logs)`
- [ ] view logs by client/project `(GET /logs/:clientId/:projectId)`
- [ ] update log `(PUT /logs/:logId)`
- [ ] delete log `(DELETE /logs/:logId)`

---

## ⏰ Reminders

- [ ] create reminder `(POST /reminders)`
- [ ] list reminders `(GET /reminders)`
- [ ] update reminder `(PUT /reminders/:reminderId)`
- [ ] delete reminder `(DELETE /reminders/:reminderId)`
- [ ] display summary of reminders due this week `(GET /reminders/summary)`
- [ ] validate reminder dates and associations

---

## 📊 Dashboard

- [ ] fetch own dashboard summary `(GET /dashboard/summary)`
- [ ] get own total clients count
- [ ] get own total projects count
- [ ] show own reminders due soon count (less than 7 days)
- [ ] show own projects by status count (idle, in-progress, finished)
- [ ] choose and implement data visualization method (charts, stats cards, etc.)
