import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../../utils'
import { deleteblog } from '../../businessLogicLayer/blogs'

import 'source-map-support/register'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event', event)

    const blogId = event.pathParameters.blogId
    const userId = getUserId(event)

    await deleteblog(blogId, userId)

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
