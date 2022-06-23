import * as React from 'react'
import Auth from '../auth/Auth'
import { createPost } from '../api/blogs-api'
import { Form, TextArea, Input, Divider, Header } from 'semantic-ui-react'

interface CreatePostProps {
  auth: Auth
}

interface CreatePostState {
  title: string
  text: string
  uploadingPost: boolean
}

export class CreatePost extends React.PureComponent<CreatePostProps, CreatePostState> {
  state: CreatePostState = {
    title: '',
    text: '',
    uploadingPost: false,
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value })
  }

  handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.title || !this.state.text) {
        alert('Title and text should be provided')
        return
      }

      this.setUploadState(true)
      const post = await createPost(this.props.auth.getIdToken(), {
        title: this.state.title,
        text: this.state.text,
      })

      this.setState({
        title: '',
        text: '',
      })

      console.log('Created post', post)

      alert('Blog was created!')
    } catch (e) {
      alert('Could not create: ' + e.message)
    } finally {
      this.setUploadState(false)
    }
  }

  setUploadState(uploadingPost: boolean) {
    this.setState({
      uploadingPost,
    })
  }

  render() {
    return (
      <div>
        <Header as="h1" floated="left">
          Create Blog
        </Header>
        <Divider clearing />
        {this.renderForm()}
      </div>
    )
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field
          control={Input}
          label="Title"
          placeholder="Title"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <Form.Field
          control={TextArea}
          label="Text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        ></Form.Field>
        <Form.Button loading={this.state.uploadingPost} type="submit">
          Create
        </Form.Button>
      </Form>
    )
  }
}
