# Simple Cloud Service (SCS)

This is a Node.js application for managing documents and repositories, "Simple Cloud Storage" (SCS), is a web-based storage solution inspired by Amazon S3. SCS empowers users to manage and secure their data, offering valuable insights into distributed systems, data security, and backend development.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Document Management](#document-management)
  - [Repository Management](#repository-management)
  - [Search](#search)

## Installation

1. Clone the repository to your local machine.
2. Run `npm install` to install the required dependencies.
3. Set up your environment variables in a `.env` file.
4. Start the application using `npm start`.

## API Endpoints

### Authentication

#### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request Body:**
  - `email` (string) - User's email address.
  - `password` (string) - User's password.
- **Response:**
  - `msg` (string) - Success message.

#### Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Log in an existing user.
- **Request Body:**
  - `email` (string) - User's email address.
  - `password` (string) - User's password.
- **Response:**
  - `token` (string) - JWT token for authentication.

### Document Management

#### Create Document

- **URL:** `/api/document/create`
- **Method:** `POST`
- **Description:** Create a new document.
- **Authentication:** Token required.
- **Request Body:**
  - `name` (string) - Document name.
  - `description` (string, optional) - Document description.
  - `uploadedFile`: { `fileName`, `contentType` },
  - `accessType` (string) - Document access type ('public' or 'private' or 'shared').
  - `sharedAccessUsers` (array, optional) - Users with allowed access.
  - `customTags` (array, optional) - Custom tags.
  - `repositoryId` (string) - ID of the repository to which the document belongs.
- **Response:**
  - `preSignedPUTUrl` (string) - Pre-signed URL for uploading the document.
  - `msg` (string) - Success message.

#### Get All Documents

- **URL:** `/api/document/getAll?repositoryId={repositoryId}`
- **Method:** `GET`
- **Description:** Get all documents in a repository.
- **Authentication:** Token required.
- **Response:**
  - `documents` (array) - List of documents in the repository.

#### Get Document by ID

- **URL:** `/api/document/get/{documentId}`
- **Method:** `GET`
- **Description:** Get a document by ID.
- **Authentication:** Token required.
- **Response:**
  - `document` (object) - The document.

#### Update Document

- **URL:** `/api/document/update`
- **Method:** `PUT`
- **Description:** Updates an existing document's information.
- **Authentication:** Token required.
- **Request Body:**
  - `documentId` (string) - ID of the document to be updated.
  - Other fields that you want to update (e.g., `name`, `description`, `accessType`, `sharedAccessUsers`, `customTags`).
- **Response:**
  - `msg` (string) - Success message.

#### Delete Document

- **URL:** `/api/document/delete`
- **Method:** `DELETE`
- **Description:** Deletes a document by its unique ID.
- **Authentication:** Token required.
- **Request Body:**
  - `documentId` (string) - ID of the document to be deleted.
  - `repositoryId` (string) - ID of the repository to be deleted.
  - `fileName` (string) - fileName field of file to be deleted.

- **Response:**
  - `msg` (string) - Success message.

#### View Document

- **URL:** `/api/document/view`
- **Method:** `GET`
- **Description:** Retrieves a pre-signed URL for viewing a document. This URL can be used to access the document for viewing purposes.
- **Authentication:** Token required.
- **Query Parameters:**
  - `fileName` (string) - The name of the document file.
  - `documentId` (string) - The ID of the document.
- **Response:**
  - Pre-signed URL for viewing the document.

#### Download Document

- **URL:** `/api/document/download`
- **Method:** `GET`
- **Description:** Retrieves a pre-signed URL for downloading a document. This URL can be used to download the document file.
- **Authentication:** Token required.
- **Query Parameters:**
  - `fileName` (string) - The name of the document file.
  - `documentId` (string) - The ID of the document.
- **Response:**
  - file in binary format to be opened in client side

### Repository Management

#### Create Repository

- **URL:** `/api/repository/create`
- **Method:** `POST`
- **Description:** Create a new repository.
- **Authentication:** Token required.
- **Request Body:**
  - `name` (string) - Repository name.
  - `description` (string, optional) - Repository description.
  - `accessType` (string) - Repository access type ('public' or 'private').
  - `sharedAccessUsers` (array, optional) - Users with shared access.
  - `customTags` (array, optional) - Custom tags.
- **Response:**
  - `msg` (string) - Success message.


### Get All Repositories

- **URL:** `/api/repository/getAll`
- **Method:** `GET`
- **Description:** Retrieves all repositories associated with the currently authenticated user.
- **Authentication:** Token required.
- **Response:**
  - `repositories` (array) - List of repositories belonging to the user.

### Get Repository by ID

- **URL:** `/api/repository/get/{repositoryId}`
- **Method:** `GET`
- **Description:** Retrieves a repository by its unique ID.
- **Authentication:** Token required.
- **Response:**
  - `repository` (object) - The repository corresponding to the provided `repositoryId`.

### Create Repository

- **URL:** `/api/repository/create`
- **Method:** `POST`
- **Description:** Creates a new repository.
- **Authentication:** Token required.
- **Request Body:**
  - `name` (string) - Repository name.
  - `description` (string, optional) - Repository description.
  - `accessType` (string) - Repository access type ('public' or 'private').
  - `sharedAccessUsers` (array, optional) - Users with shared access.
  - `customTags` (array, optional) - Custom tags.
- **Response:**
  - `msg` (string) - Success message.

### Update Repository

- **URL:** `/api/repository/update`
- **Method:** `PUT`
- **Description:** Updates an existing repository's information.
- **Authentication:** Token required.
- **Request Body:**
  - `repositoryId` (string) - ID of the repository to be updated.
  - Other fields that you want to update (e.g., `name`, `description`, `accessType`, `sharedAccessUsers`, `customTags`).
- **Response:**
  - `msg` (string) - Success message.

### Delete Repository

- **URL:** `/api/repository/delete/{repositoryId}`
- **Method:** `DELETE`
- **Description:** Deletes a repository by its unique ID.
- **Authentication:** Token required.
- **Response:**
  - `msg` (string) - Success message.


#### Search Repositories and Documents

- **URL:** `/api/search`
- **Method:** `POST`
- **Description:** Searches for documents and repositories based on user-defined criteria, including user IDs and keywords.
- **Authentication:** Token required.
- **Request Body:**
  - `userIds` (array, optional) - An array of user IDs to filter results by.
  - `keywords` (array, optional) - An array of keywords to search for within document and repository descriptions.
- **Response:**
  - `repositories` (array) - List of repositories matching the search criteria.
  - `documents` (array) - List of documents matching the search criteria.
