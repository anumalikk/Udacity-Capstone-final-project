import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { blogItem } from '../models/BlogItem'
import { blogUpdate } from '../models/BlogUpdate'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import 'source-map-support/register'

const XAWS = AWSXRay.captureAWS(AWS)

export class blogsAccess {
  constructor(
    //private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bloggerTable = process.env.blogger_TABLE,
    private readonly blogIndex = process.env.blog_DATE_INDEX,
    private readonly s3Bucket = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) {}

  async getAllblogs(): Promise<blogItem[]> {
    console.log('Get all blogs')

    const result = await this.docClient
      .scan({
        TableName: this.bloggerTable,
        IndexName: this.blogIndex,
      })
      .promise()

    const items = result.Items
    return items as blogItem[]
  }

  async getAllblogsByUser(userId: string): Promise<blogItem[]> {
    console.log('Get all blogs for user', userId)

    const result = await this.docClient
      .query({
        TableName: this.bloggerTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise()

    const items = result.Items
    return items as blogItem[]
  }

  async createblog(blogItem: blogItem): Promise<blogItem> {
    console.log('Create new blog', blogItem)

    await this.docClient
      .put({
        TableName: this.bloggerTable,
        Item: blogItem,
      })
      .promise()

    return blogItem
  }

  async updateblog(blogId: string, userId: string, blogUpdate: blogUpdate): Promise<blogUpdate> {
    console.log('Update blog', blogId, userId, blogUpdate)

    await this.docClient
      .update({
        TableName: this.bloggerTable,
        Key: {
          userId: userId,
          blogId: blogId,
        },
        UpdateExpression: 'set #title = :title, #text = :text',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#text': 'text',
        },
        ExpressionAttributeValues: {
          ':title': blogUpdate.title,
          ':text': blogUpdate.text,
        },
      })
      .promise()

    return blogUpdate
  }

  async deleteblog(blogId: string, userId: string): Promise<void> {
    console.log('Delete blog', blogId)

    await this.docClient
      .delete({
        TableName: this.bloggerTable,
        Key: {
          blogId: blogId,
          userId: userId,
        },
      })
      .promise()
  }

  async addImageUrl(blogId: string, userId: string) {
    const imageUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${blogId}`

    console.log(`Add imageUrl ${imageUrl} to blog ${blogId}`)

    await this.docClient
      .update({
        TableName: this.bloggerTable,
        Key: {
          blogId: blogId,
          userId: userId,
        },
        UpdateExpression: 'set #imageUrl = :imageUrl',
        ExpressionAttributeNames: {
          '#imageUrl': 'imageUrl',
        },
        ExpressionAttributeValues: {
          ':imageUrl': imageUrl,
        },
      })
      .promise()
  }

  generateUploadUrl(blogId: string): string {
    console.log('Generate S3 upload url for blog', blogId)

    return this.s3.getSignedUrl('putObject', {
      Bucket: this.s3Bucket,
      Key: blogId,
      Expires: this.urlExpiration,
    })
  }
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
