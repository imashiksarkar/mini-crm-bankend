# ✅ General Setup & Quality

- [ ] add eslint
- [x] add prettier
- [x] add .env and environment variable support

---

## 🧑‍💻 Auth

- **Role: User**

  - [x] user signup `(POST /auth/signup)`
  - [x] user signin `(POST /auth/signin)`
  - [x] user signout `(DELETE /auth/signout)`
  - [x] refresh token `(POST /auth/refresh)`
  - [x] protect all user routes (middleware)
  - [x] persist session/token securely
  - [x] add password hashing
  - [x] validate input data (Zod)

- **Role: Admin**
  - [x] change user role `(PUT /auth/roles)`
  - [x] fetch allowed roles `(GET /auth/roles)`

---

## 👥 Client

- **Role: User**

  - [x] create own client `(POST /clients)`

    - input payload
      - name: string
      - email: string
      - phone: string
      - company?: string
      - notes?: string

  - [x] update own client `(PUT /clients/:clientId)`
  - [x] delete own client `(DELETE /clients/:clientId)`
  - [x] view own clients `(GET /clients)`
  - [x] view own client details `(GET /clients/:clientId)`

- **Role: Admin**

  - [ ] view all users `(GET /users)`
  - [ ] view all user by id `(GET /users/:userId)`
  - [ ] view all clients by user `(GET /users/:userId/clients)`

---

## 📁 Project

- **Role: User**

  - [x] create own project for own client `(POST /clients/:clientId/projects)`
  - [x] update own project `(PUT /projects/:projectId)`
  - [x] delete own project `(DELETE /projects/:projectId)`
  - [ ] view own projects `(GET /projects)`
  - [ ] view own project details `(GET /projects/:projectId)`
  - [ ] view own projects by client `(/projects/client/:clientId)`

<!-- - **Role: Admin** -->

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
