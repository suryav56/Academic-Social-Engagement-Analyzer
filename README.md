# 🚗 Vehicle Rental Management System

A full-stack web application developed using Spring Boot to manage vehicles, customers, and rental bookings.

## 📌 Features

- Manage Vehicles (Add, Update, Delete, View)
- Manage Customers (Add, Update, Delete, View)
- Rent Vehicles to Customers
- Automatically update vehicle availability
- Dashboard with live statistics
- Responsive UI using Bootstrap
- MySQL database integration
- Spring Data JPA for database operations

## 🛠️ Tech Stack

- Java 21
- Spring Boot
- Spring Data JPA
- Thymeleaf
- MySQL
- Bootstrap 5
- Maven
- Git & GitHub

## 📂 Project Structure

```
src
 ├── controller
 ├── model
 ├── repository
 ├── service
 ├── templates
 └── resources
```

## 🚀 How to Run

1. Clone the repository

```
git clone https://github.com/suryav56/<your-repository-name>.git
```

2. Create a MySQL database

```
CREATE DATABASE rental_db;
```

3. Configure `application.properties`

```
spring.datasource.url=jdbc:mysql://localhost:3306/rental_db
spring.datasource.username=root
spring.datasource.password=your_password
```

4. Run the application

5. Open:

```
http://localhost:8080
```

## 👨‍💻 Author

Surya V
