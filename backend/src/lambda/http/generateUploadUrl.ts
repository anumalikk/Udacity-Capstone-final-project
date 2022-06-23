import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../../utils'
import { generateUploadUrl } from '../../businessLogicLayer/blogs'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event', event)

    const blogId = event.pathParameters.blogId
    const userId = getUserId(event)

    const uploadUrl = await generateUploadUrl(blogId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true,
  })
)
