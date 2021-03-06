import Axios from 'axios'
import { BlogModel } from '../types/BlogModel'
import { apiEndpoint } from '../config'
import { CreateBlogRequest } from '../types/CreateBlogRequest'
import { UpdateBlogRequest } from '../types/UpdateBlogRequest'

export async function getPosts(idToken: string): Promise<BlogModel[]> {
  console.log('Fetching posts')

  const response = await Axios.get(`${apiEndpoint}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })

  const sortedItems = response.data.items.sort(sortByDate)

  console.log('Posts: ', sortedItems)
  return sortedItems
}

export async function getUserPosts(userId: string, idToken: string): Promise<BlogModel[]> {
  console.log('Fetching user posts', userId)

  const response = await Axios.get(`${apiEndpoint}/users/${userId}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })

  const sortedItems = response.data.items.sort(sortByDate)

  console.log('Posts: ', sortedItems)
  return sortedItems
}

export async function createPost(idToken: string, newPost: CreateBlogRequest): Promise<BlogModel> {
  console.log('Creating post')

  const response = await Axios.post(`${apiEndpoint}/posts`, JSON.stringify(newPost), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
  return response.data.item
}

export async function editPost(idToken: string, updatePost: UpdateBlogRequest): Promise<void> {
  console.log('Editing post')

  await Axios.patch(
    `${apiEndpoint}/posts/${updatePost.postId}`,
    JSON.stringify({
      title: updatePost.title,
      text: updatePost.text,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    }
  )
}

export async function deletePost(idToken: string, postId: string): Promise<void> {
  console.log('Delete post')

  await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
}

export async function getUploadUrl(idToken: string, postId: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/posts/${postId}/image`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

function sortByDate(a: BlogModel, b: BlogModel) {
  const timeA = new Date(a.createdAt).getTime()
  const timeB = new Date(b.createdAt).getTime()

  if (timeA < timeB) {
    return 1
  }
  if (timeA > timeB) {
    return -1
  }
  return 0
}
