# 📘 Task and Course Management API

## 🇬🇧 English

### 🔧 Technologies Used

* **NestJS** (Backend framework)
* **MongoDB + Mongoose** (Database)
* **TypeScript**
* **JWT** (Authentication)
* **bcrypt** (Password hashing)
* **Swagger** (API Documentation)

---

### 🚀 Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
# Create a `.env` file in root:
APP_PORT=3000
APP_HOST=localhost

JWT_ACCESS_SECRET=secret123
JWT_ACCESS_EXPIRES_IN=1d

MONGO_URI=mongodb://localhost:27017/task

# 3. Run the app
npm run start:dev
```

---

### 🔑 Authentication Endpoints

* `POST /auth/register` – Register user (admin/teacher/student)
* `POST /auth/login` – Login and get access token (JWT)

---

### 🎯 Functional Endpoints

#### 📝 Tasks

* `POST /tasks` – Create task (`admin` and `teacher` only)
* `GET /tasks` – Get tasks for logged in user (students see assigned, teachers see created, admins see all)
* `GET /tasks/:id` – Get single task (access control applied)
* `PUT /tasks/:id` – Update task (only creator or admin)
* `DELETE /tasks/:id` – Delete task (only creator or admin)

#### 📚 Courses

* `POST /courses` – Create course (admin only)
* `GET /courses` – List all courses
* `POST /courses/:courseId/register` – Student registers to course
* `GET /students/:id/courses` – Get student’s courses (auth required)

#### 👥 Students

* `POST /auth/register` – Register a new student.
A new user with the role student is created. No token is returned upon registration.
* `POST /auth/login` – Login as a student.
Upon successful login, a JWT token is returned.
🔔 Note: All user types (student, teacher, and admin) are stored in a single users collection, differentiated by their role field.

---

### 🧠 Business Logic & Rules

* JWT-based authentication & role guard
* Student can’t register same course twice
* Role-based access control for task & course actions
* Swagger integrated for API testing
* Seeding logic adds:

  * 1 Admin
  * 3 Teachers
  * 2 Students
  * 2 Courses
  * Each student assigned 2 tasks (MongoDB & NestJS topics)

---

### 📘 Sample Credentials

```txt
Admin: admin@gmail.com / admin123
Teacher: teacher@gmail.com / teacher123
Student1: student1@gmail.com / student123
Student2: student2@gmail.com / student123
```

---

## 🇺🇿 O'zbekcha

### 🔧 Texnologiyalar

* **NestJS** (Backend freymvork)
* **MongoDB + Mongoose** (Ma'lumotlar bazasi)
* **TypeScript**
* **JWT** (Autentifikatsiya)
* **bcrypt** (Parolni xeshlash)
* **Swagger** (API hujjati)

---

### 🚀 Loyihani ishga tushurish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. .env fayl yarating:
APP_PORT=3000
APP_HOST=localhost

JWT_ACCESS_SECRET=secret123
JWT_ACCESS_EXPIRES_IN=1d

MONGO_URI=mongodb://localhost:27017/task

# 3. Loyihani ishga tushurish
npm run start:dev
```

---

### 🔑 Autentifikatsiya Endpointlari

* `POST /auth/register` – Foydalanuvchi ro'yxatdan o'tkazish
* `POST /auth/login` – Kirish va JWT token olish

---

### 🎯 Funksional Endpointlar

#### 📝 Vazifalar (Tasks)

* `POST /tasks` – Yangi vazifa yaratish (`admin` va `teacher`)
* `GET /tasks` – Kirgan foydalanuvchiga tegishli vazifalarni olish
* `GET /tasks/:id` – Bitta vazifani ko‘rish
* `PUT /tasks/:id` – Vazifani tahrirlash (faqat yaratgan foydalanuvchi yoki admin)
* `DELETE /tasks/:id` – Vazifani o‘chirish (faqat yaratgan foydalanuvchi yoki admin)

#### 📚 Kurslar

* `POST /courses` – Yangi kurs yaratish (faqat admin)
* `GET /courses` – Barcha kurslarni ko‘rish
* `POST /courses/:courseId/register` – Student kursga yoziladi
* `GET /students/:id/courses` – Student o‘z kurslarini ko‘radi

#### 👥 Studentlar

* `POST /auth/register` – Student ro‘yxatdan o‘tkazish. Registerdan o'tkanda token berilmidi yengi user yaratiladi student role bilan
* `POST /auth/login` – Student login qilish. Login qilishda token beriladi 

🔔 Eslatma: Barcha foydalanuvchi turlari (student, teacher va admin) yagona users kolleksiyasida saqlanadi va ular role maydoni orqali farqlanadi.
---

### 🧠 Qoidalar va Mantiq

* JWT orqali autentifikatsiya
* Student bir kursga ikki marta yozila olmaydi
* Ruxsatlar roli asosida boshqariladi
* Swagger orqali API test qilish mumkin
* Seed orqali quyidagi malumotlar kiritiladi:

  * 1 ta admin
  * 3 ta o‘qituvchi
  * 2 ta student
  * 2 ta kurs (NestJS va MongoDB)
  * Har bir studentga 2 tadan task biriktiriladi

---

### 📘 Namuna Login Ma'lumotlar

```txt
Admin: admin@gmail.com / admin123
Teacher: teacher@gmail.com / teacher123
Student1: student1@gmail.com / student123
Student2: student2@gmail.com / student123
```