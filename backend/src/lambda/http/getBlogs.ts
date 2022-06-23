import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllblogs } from '../../businessLogicLayer/blogs'

import 'source-map-support/register'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event', event)

    const blogs = await getAllblogs()

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: blogs,
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true,
  })
)
