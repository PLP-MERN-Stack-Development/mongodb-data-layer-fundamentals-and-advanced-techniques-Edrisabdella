# 📚 PLP Bookstore – MongoDB Assignment

This project demonstrates **MongoDB fundamentals** including **CRUD operations, advanced queries, aggregation pipelines, and indexing** using a bookstore database.  
It is part of the PLP Academy assignment on **Data Layer Fundamentals and Advanced Techniques**.

---

## 🚀 Features
- Database setup and population with sample book data  
- Basic CRUD operations (Create, Read, Update, Delete)  
- Advanced queries (filtering, projection, sorting, pagination)  
- Aggregation pipelines for analytics  
- Indexing and performance analysis  

---

## 🛠️ Technologies Used
- **Node.js** (JavaScript runtime)  
- **MongoDB** (NoSQL database)  
- **MongoDB Node.js Driver**  

---

## 📂 Project Files
- **insert_books.js** → Script to create the database and populate it with sample book data  
- **queries.js** → Contains all MongoDB queries for the assignment tasks  
- **README.md** → Documentation and setup guide  

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/)  
- Install [MongoDB](https://www.mongodb.com/try/download/community) locally OR create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster  

### 2. Installation
Clone this repository and install dependencies:
```bash
git clone <your-repository-url>
cd plp-bookstore-mongodb
npm install mongodb

3. Configure Database

Local MongoDB: Ensure MongoDB is running on mongodb://localhost:27017

MongoDB Atlas: Replace the uri in both scripts (insert_books.js, queries.js) with your Atlas connection string

4. Run the Scripts

Populate the database with sample books:
bash
node insert_books.js

Run all queries:
bash
node queries.js

node queries.js
📊 Tasks Implemented
✅ Task 1: MongoDB Setup
Database: plp_bookstore

Collection: books

✅ Task 2: Basic CRUD Operations
Find books by genre, year, author

Update book prices

Delete books by title

✅ Task 3: Advanced Queries
Filter books (e.g., in stock & published after 2010)

Field projection (title, author, price)

Sorting (ascending & descending)

Pagination with limit and skip

✅ Task 4: Aggregation Pipeline
Average price by genre

Author with the most books

Group books by publication decade

✅ Task 5: Indexing
Single-field index (title)

Compound index (author, published_year)

Performance analysis using explain()

🎯 How to Run
1. Start MongoDB (for local setup):

bash

mongod
2. Insert book data:
bash

node insert_books.js
3. Execute queries:
bash

node queries.js
---
📸 Expected Output

The queries.js script will log results to the console, including:

CRUD operation results

Advanced query results (filtered lists, projections, sorted data, paginated results)

Aggregated data (average price by genre, author with most books, books by decade)

Indexing performance improvements

👨‍💻 Author: Edris Abdella
📌 Assignment: PLP Bookstore MongoDB Project
