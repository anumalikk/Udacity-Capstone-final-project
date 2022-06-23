import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { BlogModel } from '../types/BlogModel'
import { getPosts, getUserPosts } from '../api/blogs-api'
import { Header, Grid, Loader, Divider, Card, Button } from 'semantic-ui-react'
import { Post } from './Blog'
import { Link } from 'react-router-dom'

interface PostsProps {
  auth: Auth
  history: History
  userPosts: boolean
}

interface PostsState {
  posts: BlogModel[]
  newPostName: string
  loadingPosts: boolean
}

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    posts: [],
    newPostName: '',
    loadingPosts: true,
  }

  constructor(props: PostsProps) {
    super(props)

    this.refreshPosts = this.refreshPosts.bind(this)
  }

  componentDidMount() {
    this.refreshPosts()
  }

  async refreshPosts() {
    this.setState({
      loadingPosts: true,
    })

    try {
      let posts
      if (this.props.userPosts) {
        posts = await getUserPosts(this.props.auth.userInfo, this.props.auth.getIdToken())
      } else {
        posts = await getPosts(this.props.auth.getIdToken())
      }

      this.setState({
        posts,
        loadingPosts: false,
      })
    } catch (e) {
      alert(`Failed to fetch blogs: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" floated="left">
          {this.props.userPosts && 'My Blogs'}
          {!this.props.userPosts && 'Blogs'}
        </Header>
        <Button primary floated="right" as={Link} to="/posts/create">
          Create Blog
        </Button>
        <Divider clearing />
        {this.renderPosts()}
      </div>
    )
  }

  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderPostsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Blogs
        </Loader>
      </Grid.Row>
    )
  }

  renderPostsList() {
    return (
      <div>
        <Card.Group>
          {this.state.posts.map((post) => {
            return (
              <Post
                key={post.postId}
                {...this.props}
                post={post}
                userId={this.props.auth.userInfo}
                refreshPosts={this.refreshPosts}
              />
            )
          })}
        </Card.Group>
      </div>
    )
  }
}
