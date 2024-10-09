# Project Documentation

## 1. Repository Organization and Usage
- **Overview of Repository Structure**  
  The root folder of the repository contains a gitignore file, this readme, and a folder containing the whole project.
- **Branching Strategy**  
During the first part of the project, new branches were created for each update to the git. Due to lack of time, the second part  
of the project was not branched, and all changes were pushed to the main branch.
- **Commit Message Conventions**  
Commit messages were always between 3 to 10 words, and gave a brief description on the changes made.

## 2. Data Structures
- **Users**  
  The users are stored in a Mongo Database under the 'users' collection. They have the following structure:

  {
    _id?: string;  
    username: string;  
    password?: string;  
    email: string;  
    userid?: number;  
    roles: string[];  
    groups: string[];  
    profilePicture?: string;  
}
- **Groups**  
  Groups are also stores in the same Mongo Database under the 'groups' collection. They have the following structure:  
  {
    _id?: string;  
    groupName: string;  
    admins: string[];  
    users: string[];  
}

## 3. API Routes and Endpoints  
### User DB Operations
- **Post** /userInsert
  - *Parameters*: (username, password, email, groups, roles)
  - *Return Values*: Success Message with inserted user or error message (if user exists already).
  - *Purpose*: Adds a new user to the users collection in the database.
    
- **Post** /userUpdate
  - *Parameters*: Needs query and update objects in request body
  - *Return Values*: Confirmation of success
  - *Purpose*: Updates existing user object in database.

- **Post** /userDelete
  - *Parameters*: User Identifiers (_id) in request body.
  - *Return Values*: Confirmation of deletion or error.
  - *Purpose*: Delets a user from the database.

- **Get** /userFind
  - *Parameters*: None.
  - *Return Values*: List of all users in database.
  - *Purpose*: Gets all the users from the database.

- **Post** /login
  - *Parameters*: username and password required in request body.
  - *Return Values*: User details on login or error if username and password are incorrect.
  - *Purpose*: Authenticates users and allows access.

- **Post** /uploadProfilePicture
  - *Parameters*: a file and username in request body.
  - *Return Values*: success message and file path or error.
  - *Purpose*: Uploads a users profile picture and stores path in database.

- **Get** /getProfilePicture
  - *Parameters*: Username as query parameter.
  - *Return Values*: File path of profile picture or error if no found.
  - *Purpose*: Gets the file path from user.profilePicture in database.

### Group DB operations  
- **Post** /groupInsert
  - *Parameters*: group data (name, users, admins)
  - *Return Values*: Success message and group or error.
  - *Purpose*: Adds new group to the database.

- **Post** /groupFind
  - *Parameters*: None
  - *Return Values*: List of all groups in database.
  - *Purpose*: Retrieves all groups from database.

- **Post** /groupUpdate
  - *Parameters*: Query and Update objects.
  - *Return Values*: Confirmation of update.
  - *Purpose*: Updates details of group in database.

- **Post** /groupDelete
  - *Parameters*: Group identifier (_id).
  - *Return Values*: Confirmation of delete or error message.
  - *Purpose*: Deletes group from the database.

### File operations  
- **Post** /uploadChatImage
  - *Parameters*: Image file
  - *Return Values*: success message or error if upload fails.
  - *Purpose*:  Handles uploading images in chat.


## 4. Angular Architecture
The components handle the UI and specific functions like sending chats, logging in or managing groups and users.
The services handle communication with the backend server, and make it easier to share data across components.
The models provide structures that are used to share data between components or the back end.
### Components  
- **chat**  
  The chat component contains the structure and styling of the chat room,  
  as well as functionality for sockets and peer-to-peer connections.
  
- **groups**  
    The groups component contains lists all the groups, and provides functionality to add or remove groups.
- **login**  
    The login component contains a login and sign up form which authenticates users or adds new users to the database.
- **profile**  
    The profile component shows the current users details, and provides functionality to edit these details.
- **user-edit**  
    The user-edit component allows an admin to change the roles and the groups of other users.
- **users**  
    The users component gets all the users from the database and displays them in a table.
  users can be deleted on this component
- **app**
  The app component is the root component and does not provide and visible details to the project.
    
  
### **Services**  
- **UserService**  
Handles API requests related to user management, such as login, registration, profile picture upload, and fetching user details.

- **GroupService**  
Manages API requests related to groups, such as creating, updating, deleting, and fetching group data.

- **SocketService**  
Manages Socket.IO connections for real-time communication in the chat component, enabling features like sending and receiving messages instantly.


### **Models**
- **User odel**
Defines the structure of the user object (exports a interface with the above user structure).

- **GroupModel**
Defines the structure of the group object (exports a interface with the above group structure).

