# Serverless Blogger

This application is a Blogger application using AWS Lambda and Serverless framework.

It consists of the `backend` and an additional `client` implemented with React.

## Functionality

As a user you are able to see all blogs that have been created so far. This includes your own blogs and all blogs created by others.

You can also only have a list of your own blogs.

Own blogs, which are highlighted with a green color, can be edited or deleted. Once you edit a blog, there's the possibility to upload an image which will be displayed together with the blog.

## Deploy backend

In order to deploy the backend run the following command inside the `backend` directory:

```
serverless deploy -v
```

## Client

### Configure

The Client application uses Auth0 to authenticate with the service. Therefore you need to create an [Auth0 account](https://auth0.com/) and afterwards a new application.

To have a connection to the backend, provide the `apiId` and Auth0 configuration in the config file.

```
// client/src/config.ts

const apiId = '' // AWS apiId created by Serverless framework
const auth0Domain = '' // Domain of your Auth0 account
const auth0ClientId = '' // ClientId of your Auth0 application
```

### Run

To run the React client run the following command inside the `client` directory. This will start a development server.

```
npm start

  // or

yarn start
```

## API

### Get Blogs

Returns all blogs that have been created so far.

```http
GET /posts
```

#### Response

```javascript
{
  "items": [
    {
      "createdAt": string,
      "text": string,
      "postId": string,
      "userId": string,
      "title": string,
      "imageUrl": string (optional)
    }
  ]
}
```

### Get Blogs by User

Returns all blogs that have been created by a specific user.

```http
GET /users/{userId}/posts
```

| Parameter | Type     | Description               |
| :-------- | :------- | :------------------------ |
| `userId`  | `string` | **Required** The users ID |

#### Response

```javascript
{
    "items": [
    {
      "createdAt": string,
      "text": string,
      "postId": string,
      "userId": string,
      "title": string,
      "imageUrl": string (optional)
    }
  ]
}
```

### Create Blog

Create a new blog.

```http
POST /posts
```

#### Payload

```javascript
{
  "title": string,
  "text": string
}
```

#### Response

```javascript
{
  "item": {
    "userId": string,
    "postId": string,
    "createdAt": string,
    "title": string,
    "text": string
  }
}
```

### Update Blog

Update an existing blog.

```http
PATCH /posts/{postId}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `string` | **Required** The ID of the existing blog |

#### Payload

```javascript
{
  "title": string,
  "text": string
}
```

#### Response

```javascript
"";
```

### Delete Blog

Delete an existing blog.

```http
DELETE /posts/{postId}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `string` | **Required** The ID of the existing blog |

#### Response

```javascript
"";
```

### Get Upload URL

Get an URL to upload an image to S3.

```http
POST /posts/{postId}/image
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `postId`  | `string` | **Required** The ID of the existing blog |

#### Response

```javascript
{
  "uploadUrl": string
}
```
