import * as uuid from 'uuid'

import { blogsAccess } from '../dataAccessLayer/blogsAccess'
import { blogItem } from '../models/BlogItem'
import { CreateblogRequest } from '../requests/CreateBlogRequest'
import { UpdateblogRequest } from '../requests/UpdateBlogRequest'

import 'source-map-support/register'

const blogAccess = new blogsAccess()

export async function getAllblogs(): Promise<blogItem[]> {
  return blogAccess.getAllblogs()
}

export async function getAllblogsByUser(userId: string): Promise<blogItem[]> {
  return blogAccess.getAllblogsByUser(userId)
}

export async function createblog(createblogRequest: CreateblogRequest, userId: string): Promise<blogItem> {
  const itemId = uuid.v4()

  return await blogAccess.createblog({
    userId: userId,
    blogId: itemId,
    createdAt: new Date().toISOString(),
    title: createblogRequest.title,
    text: createblogRequest.text,
  })
}

export async function updateblog(blogId: string, userId: string, updateblogRequest: UpdateblogRequest) {
  return await blogAccess.updateblog(blogId, userId, {
    title: updateblogRequest.title,
    text: updateblogRequest.text,
  })
}

export async function deleteblog(blogId: string, userId: string) {
  return await blogAccess.deleteblog(blogId, userId)
}

export async function generateUploadUrl(blogId: string, userId: string) {
  const uploadUrl = blogAccess.generateUploadUrl(blogId)

  console.log('Add image url to blog', blogId)
  await blogAccess.addImageUrl(blogId, userId)

  return uploadUrl
}
