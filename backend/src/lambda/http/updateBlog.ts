import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateblogRequest } from '../../requests/UpdateBlogRequest'
import { getUserId } from '../../utils'
import { updateblog } from '../../businessLogicLayer/blogs'

import 'source-map-support/register'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event', event)

    const blogId = event.pathParameters.blogId
    const updatedblog: UpdateblogRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    await updateblog(blogId, userId, updatedblog)

    return {
      statusCode: 200,
      body: '',
    }
  }
)

handler.use(
  cors({
    credentials: true,
  })
)
