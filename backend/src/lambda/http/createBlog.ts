import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateblogRequest } from '../../requests/CreateBlogRequest'
import { getUserId } from '../../utils'
import { createblog } from '../../businessLogicLayer/blogs'

import 'source-map-support/register'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event', event)

    const newblog: CreateblogRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const newItem = await createblog(newblog, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem,
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true,
  })
)
