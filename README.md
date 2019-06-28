# Example of API Rest for a shop

In this api we will manage conexions to MongoDB to save our users and customers, JWT to provide more s+ecurity to the api and uploads of images for ours collections

## Installation

You can install dependencies with NPM: 

`npm i`

## Usage

The first that you have to do is to create a `.env` in the root of the project with the code used in `env-example`

After setup the project to make it run, we will need to setup the DB using the script `npm run db:seed`. `Be carefull` If you use it after insert more entries, everything will be deleted

With this, the api will add some entries in the DB to make easier the usage of the aplication.

Finally to make run the api we will use the script `npm run start` 

## Routing 

In this app we will have 3 differents routes

### Login

This will be the main route, the one that will create the JWT that will be necessary in all the nexts routese

the route is `api/login`

### Users 

Users will be the persons that will have access to manage customers and onlu users with admin level will have the permisions to mane also users

This routes are provided to have a valid JWT that you will get loging before in the app

For this collection we will have more routes: 

#### GET

+ `api/users`: Retun all the users 

+ `api/users/:id`: Return the user selected providing the id. Also the data of all the customers that was created by that id

#### Post 

+ `api/users`: Add a new user. the json that you will need to provide should be something like this: 

```
{
	user: {
		name": "Name User",
		email: "Gmail user",
		password: "passwordUser",
		admin: true
	}
}
```
the value `admin` by default is `false`, you don't have to add it if you don't want

+ `api/users/search`: Return all the data that match with the parans that you want to send

This route has two type of params: 
  `Query`: used to take the skip and limit for a possible pagination
  `body`: used to take the filter params. The json should be like this:
  
  ```
  {
	searchParams: [
		{
			type: "admin",
			value: [true]	
		}
	]
}
  
  ```
You can find by more types using the same structure and if you want to find by two values of the same type, you can manage it like this: `value:['value1', 'Value2']`
#### Put

+ `api/users/:id`: Make the changes that you want in the user with that id

+ `api/users/upload`: The user by default will have a empty photo, with this route you could change it

#### Delete 

+ `api/users/:id`: Delete the user that matchs with the id

### Customers

Customer will be more or less the same as routes as users, but using the route `api/customers` and two more differences

+ `api/customers`: Using param `GET` will return the info of the customers

+ `api/customers':` Using param `POST` will need to provide the json like this:

```
{
	customer : {
		name: "Name",
		surname: "Surname",
		email: "Gmail",
	}
}

```


