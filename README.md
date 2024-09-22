# Events Registration App

A simple events registration app using Node.js and MongoDB.

## Features

- The events board page where all events are shown and can be sorted by title, date or organizer.
- Events registration page where one can register for the chosen event. The registration form includes fields for full name, email, birthday date, and a radio button "where did you hear about this event?".
- Event participants page that displays all registered participants for a specific event. It also includes the ability to search for participants by full name or email.

## Tech Stack

- Node.js
- MongoDB
- Express
- EJS

## Installation

### Prerequisites

Ensure that you have the following installed on your machine:

- Node.js (v14+)
- Git

### Steps

- Clone this repo to your local machine.
- Run `npm install` to install the dependencies.
- Run `npm run dev` to start the app in development mode.
- Run `npm start` to start the production server.

### Database Setup

For the app to work properly, you must also create a cluster and a database in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register). You will get the connection string there, it will look something like this:

```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Store this string into a file called `.env` in the root directory of the project as a variable `MONGO_URI`.

You can also install MongoDB locally and create a database there. In this case, the connection string will look like this:
```
mongodb://localhost:27017/your-database-name
```

## API Endpoints

This app provides the following API endpoints:

| HTTP Method | Endpoint             | Description                                                  |
| ----------- | -------------------- | ------------------------------------------------------------ |
| GET         | `/`                  | Render the page that lists all events from the database      |
| GET         | `/:eventId/register` | Render the page to register for the event by ID              |
| POST        | `/:eventId/register` | Process the form submission to register for the event by ID  |
| GET         | `/:eventId/view`     | Render the page that lists participants for a specific event |
