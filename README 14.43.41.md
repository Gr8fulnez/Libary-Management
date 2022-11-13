# week-6-NODE-011-POD-F
# EXPRESS 

### Setup
1. Your are required to use TypeScript for the task
2. Use and setup the project with `Yarn`

## Problem Description:

Create A basic Express application, that makes a CRUD operation (create, read, update, delete) using SQLite database, document and publish your endpoints using postman.

## Requirements:
IMPLEMENT DESCRIPTIONIZATION AND AUTHENTICATION: PROTECT ALL ROUTES. ONLY THE LOGGED-IN USERS/DESCRIPTION CAN PERFORM THE FOLLOWING OPERATIONS


 -  Browse through books created by same descriptions and others.
 -  Add a new book.
 -  Edit a books created by the description.
 -  Delete a books created by the description.

## How will I complete this project?
- Your aplication should be able to perform.
  - `GET` Request which returns all the data in your database
  - `POST` Request which adds data to your database
  - `PUT` Request which updates fields of a particular data using the id in database
  - `DELETE` Request which removes a particular data from your database using the id
- Host your application on Heroku
- Data format example:This shows the data format of registered descriptions and books created by the descriptions

```javascript
[
    {
      id: 1,
      description: "John Stone",
      dateRegistered: 1637159465420,
      age: 28,
      email:"precious@gmail.com",
      password:"example",
      address: "5, Wall Street, Buckingham",
      books: [
        {
          id: "book1"
          name: "Tomorrow is coming",
          isPublished: true,
          datePublished: 1637159508581,
          serialNumber: 0010
        },
        {
          id: "book2"
          name: "October's very own",
          isPublished: false,
          datePublished: null,
          serialNumber: null
        }
      ]
    }
]
```
## Test coverage
- Make sure you write test to cover your application using Jest/supertest

### Test
- Test for a GET request
- Test for a POST request
- Test for a PUT request
- Test for a DELETE request
- Test to return proper HTTP status codes

### FRONTEND TASK
- Implement a frontend for your api.
-  Create a Login Page and Sign Up Page for Descriptions
-  A page  showing the books for all  description/user 
-  Implement  an admin area to add, edit and delete books created by the description.
