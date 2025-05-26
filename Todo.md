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
    // "role": ["user"] // default

    // output payload
    {
      "success": true,
      "code": 201,
      "data": [
        {
          "id": "abcdefghij",
          "name": "Ashik Sarkar",
          "email": "ashik@gmail.com",
          "createdAt": "2025-05-18T13:44:04.451Z",
          "updatedAt": "2025-05-18T13:44:04.451Z",
          "role": ["user"],
          "tokens": {
            "access": "xxxxx",
            "refresh": "zzzz"
          }
        }
      ]
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

  - [x] fetch user profile `(GET /auth/profile)`

  - [x] user signout `(DELETE /auth/signout)` <!-- requires access token -->
  - [x] refresh token `(POST /auth/refresh)` <!-- send refresh token via cookie -->
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

  - [x] view all users `(GET /auth/users)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "name": "Ashik Sarkar",
          "email": "ashik@gmail.com",
          "role": ["user"]
        }
      ]
    }
    ```

  - [x] view user by id `(GET /auth/users/:userId)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "name": "Ashik Sarkar",
        "email": "ashik@gmail.com",
        "role": ["user"]
      }
    }
    ```

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
    // "userId": "abcdefghij" // not accepted // taken from user token

    // output payload
    {
      "success": true,
      "code": 201,
      "data": {
        "id": "abcdefghij",
        "name": "Mario R.",
        "email": "amrio@gmail.com",
        "phone": "01234567890",
        "company": "softyMart",
        "notes": "here is a note...",
        "userId": "abcdefghij" // foreign key
      }
    }
    ```

  - [ ] update own client `(PATCH /clients/:clientId)`

    ```json
    // --- input payload ---
    {
      "name": "Mario S.", // optional
      "phone": "01237567890", // optional
      "company": "xlktc", // optional
      "notes": "here is an updated note..." // optional
    }

    // output payload
    {
      "success": true,
      "code": 201,
      "data": {
        "id": "abcdefghij",
        "name": "Mario S.",
        "email": "amrio@gmail.com",
        "phone": "01237567890",
        "company": "xlktc",
        "notes": "here is an updated note...",
        "userId": "abcdefghij"
      }
    }
    ```

  - [x] delete own client `(DELETE /clients/:clientId)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "name": "Mario S.",
        "email": "amrio@gmail.com",
        "phone": "01237567890",
        "company": "xlktc",
        "notes": "here is an updated note...",
        "userId": "abcdefghij"
      },
      "message": ["Client deleted successfully"]
    }
    ```

  - [x] view own clients `(GET /clients)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "name": "Mario S.",
          "email": "amrio@gmail.com",
          "phone": "01237567890",
          "company": "xlktc",
          "notes": "here is an updated note...",
          "userId": "abcdefghij"
        }
      ]
    }
    ```

  - [x] view own client detail `(GET /clients/:clientId)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "name": "Mario S.",
        "email": "amrio@gmail.com",
        "phone": "01237567890",
        "company": "xlktc",
        "notes": "here is an updated note...",
        "userId": "abcdefghij"
      }
    }
    ```

- **Role: Admin**

  - [ ] view all clients of a user `(GET /clients?userId=<userId>&as=admin)`

    ```json
    // all clients by all users
    // clients by user id

    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "name": "Mario S.",
          "email": "amrio@gmail.com",
          "phone": "01237567890",
          "company": "xlktc",
          "notes": "here is an updated note...",
          "userId": "abcdefghij"
        }
      ]
    }
    ```

  - [ ] view client detail `(GET /clients/:clientId?as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "name": "Mario S.",
        "email": "amrio@gmail.com",
        "phone": "01237567890",
        "company": "xlktc",
        "notes": "here is an updated note...",
        "userId": "abcdefghij"
      }
    }
    ```

  - [ ] delete client `(DELETE /clients/:clientId?as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "name": "Mario S.",
        "email": "amrio@gmail.com",
        "phone": "01237567890",
        "company": "xlktc",
        "notes": "here is an updated note...",
        "userId": "abcdefghij"
      },
      "message": ["Client deleted successfully"]
    }
    ```

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
      "deadline": "2025-05-18T13:44:04.451Z", // (> 2 days from Date.now()), iso string
      "client_id": "abcdefghij"
    }
    // "user_id" : "abcdefghij" // from user token
    // "status": "idle" // default


    // output payload
    {
    "success": true,
    "code": 201,
    "data": {
      "id": "abcdefghij",
      "clientId": "abcdefghij",
      "userId": "abcdefghij",
      "title": "React Project",
      "budget": 1000,
      "deadline": "2025-05-18T13:44:04.451Z",
      "status": "idle",
      "createdAt": "2025-05-18T13:44:04.451Z",
      "updatedAt":"2025-05-18T13:44:04.451Z"
      }
    }
    ```

  - [ ] update own project `(PATCH /projects/:projectId)`

    ```json
    // input payload
    {
      "title": "React Project", // optional
      "budget": 1000, // min $10 // optional
      "deadline": "2025-05-18T13:44:04.451Z", // ((>= 2 days from created_at) && (>= Date.now()))
      "status": "finished" // optional // allowed project status
    }


      // output payload
    {
    "success": true,
    "code": 200,
    "data": {
      "id": "abcdefghij",
      "clientId": "abcdefghij",
      "userId": "abcdefghij",
      "title": "React Project",
      "budget": 1000,
      "deadline": "2025-05-18T13:44:04.451Z",
      "status": "finished",
      "createdAt": "2025-05-18T13:44:04.451Z",
      "updatedAt":"2025-05-18T13:44:04.451Z"
      }
    }
    ```

  - [x] delete own project `(DELETE /projects/:projectId)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "clientId": "abcdefghij",
        "userId": "abcdefghij",
        "title": "React Project",
        "budget": 1000,
        "deadline": "2025-05-18T13:44:04.451Z",
        "status": "finished",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    }
    ```

  - [ ] view own projects `(GET /projects)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "clientId": "abcdefghij",
          "userId": "abcdefghij",
          "title": "React Project",
          "budget": 1000,
          "deadline": "2025-05-18T13:44:04.451Z",
          "status": "finished",
          "createdAt": "2025-05-18T13:44:04.451Z",
          "updatedAt": "2025-05-18T13:44:04.451Z"
        }
      ]
    }
    ```

  - [ ] view own projects by client `(GET /projects?clientId=...)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "clientId": "abcdefghij",
          "userId": "abcdefghij",
          "title": "React Project",
          "budget": 1000,
          "deadline": "2025-05-18T13:44:04.451Z",
          "status": "finished",
          "createdAt": "2025-05-18T13:44:04.451Z",
          "updatedAt": "2025-05-18T13:44:04.451Z"
        }
      ]
    }
    ```

  - [ ] view own project detail `(GET /projects/:projectId)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "clientId": "abcdefghij",
        "userId": "abcdefghij",
        "title": "React Project",
        "budget": 1000,
        "deadline": "2025-05-18T13:44:04.451Z",
        "status": "finished",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    }
    ```

- **Role: Admin**

  - [ ] view all projects of all users and clients `(GET /projects?as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "clientId": "abcdefghij",
          "userId": "abcdefghij",
          "title": "React Project",
          "budget": 1000,
          "deadline": "2025-05-18T13:44:04.451Z",
          "status": "finished",
          "createdAt": "2025-05-18T13:44:04.451Z",
          "updatedAt": "2025-05-18T13:44:04.451Z"
        }
      ]
    }
    ```

  - [ ] view all projects for a user `(GET /projects?userId=...&as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "clientId": "abcdefghij",
          "userId": "abcdefghij",
          "title": "React Project",
          "budget": 1000,
          "deadline": "2025-05-18T13:44:04.451Z",
          "status": "finished",
          "createdAt": "2025-05-18T13:44:04.451Z",
          "updatedAt": "2025-05-18T13:44:04.451Z"
        }
      ]
    }
    ```

  - [ ] view projects by client `(GET /projects?clientId=...&as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": [
        {
          "id": "abcdefghij",
          "clientId": "abcdefghij",
          "userId": "abcdefghij",
          "title": "React Project",
          "budget": 1000,
          "deadline": "2025-05-18T13:44:04.451Z",
          "status": "finished",
          "createdAt": "2025-05-18T13:44:04.451Z",
          "updatedAt": "2025-05-18T13:44:04.451Z"
        }
      ]
    }
    ```

  - [ ] view project detail `(GET /projects/:projectId&as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "clientId": "abcdefghij",
        "userId": "abcdefghij",
        "title": "React Project",
        "budget": 1000,
        "deadline": "2025-05-18T13:44:04.451Z",
        "status": "finished",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    }
    ```

  - [ ] delete project `(DELETE /projects/:projectId&as=admin)`

    ```json
    // output payload
    {
      "success": true,
      "code": 200,
      "data": {
        "id": "abcdefghij",
        "clientId": "abcdefghij",
        "userId": "abcdefghij",
        "title": "React Project",
        "budget": 1000,
        "deadline": "2025-05-18T13:44:04.451Z",
        "status": "finished",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    }
    ```

---

## 📝 Interaction Logs

- allowed interaction types ("calls" | "meetings" | "emails")

- [ ] create log for client/project `(POST /logs)`

  ```json
  // input payload
  {
    "clientId": "abcdefghij", // optional
    "projectId": "abcdefghij", // optional
    "interactionType": "calls", // from list of allowed interaction types
    "date": "2025-05-18T13:44:04.451Z", // when to do the interaction
    "notes": "here is a note..."
  }
  // "userId": "abcdefghij", // from user token
  // clientId or projectId is accepted


  // output payload
  {
    "success": true,
    "code": 200,
    "data": [
      {
        "id": "abcdefghij",
        "userId": "abcdefghij",
        "clientId": "abcdefghij",
        "projectId": null,
        "interactionType": "calls",
        "date": "2025-05-18T13:44:04.451Z",
        "notes": "here is a note...",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    ]
  }
  // either clientId or projectId is returned
  ```

- [ ] view logs by client `(GET /logs?clientId=...)`

  ```json
  // output payload
  {
    "success": true,
    "code": 200,
    "data": [
      {
        "id": "abcdefghij",
        "userId": "abcdefghij",
        "clientId": "abcdefghij",
        "projectId": null,
        "interactionType": "calls",
        "date": "2025-05-18T13:44:04.451Z",
        "notes": "here is a note...",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    ]
  }
  // either clientId or projectId is returned
  ```

- [ ] view logs by project `(GET /logs?projectId=...)`

  ```json
  // output payload
  {
    "success": true,
    "code": 200,
    "data": [
      {
        "id": "abcdefghij",
        "userId": "abcdefghij",
        "clientId": null,
        "projectId": "abcdefghij",
        "interactionType": "calls",
        "date": "2025-05-18T13:44:04.451Z",
        "notes": "here is a note...",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    ]
  }
  // either clientId or projectId is returned
  ```

- [ ] update log `(PUT /logs/:logId)`

  ```json
  // input payload
  {
    "interactionType": "calls", // optional
    "date": "2025-05-18T13:44:04.451Z", // optional
    "notes": "here is a note..." // optional
  }

  // output payload
  {
    "success": true,
    "code": 200,
    "data": [
      {
        "id": "abcdefghij",
        "userId": "abcdefghij",
        "clientId": "abcdefghij",
        "projectId": null,
        "interactionType": "calls",
        "date": "2025-05-18T13:44:04.451Z",
        "notes": "here is a note...",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    ]
  }
  // either clientId or projectId is returned
  ```

- [ ] delete log `(DELETE /logs/:logId)`

  ```json
  // output payload
  {
    "success": true,
    "code": 200,
    "data": [
      {
        "id": "abcdefghij",
        "userId": "abcdefghij",
        "clientId": "abcdefghij",
        "projectId": null,
        "interactionType": "calls",
        "date": "2025-05-18T13:44:04.451Z",
        "notes": "here is a note...",
        "createdAt": "2025-05-18T13:44:04.451Z",
        "updatedAt": "2025-05-18T13:44:04.451Z"
      }
    ]
  }
  ```

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
