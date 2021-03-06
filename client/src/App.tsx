import React, { Component } from 'react'
import { Segment, Grid, Menu } from 'semantic-ui-react'
import { Router, Route, Link, Switch } from 'react-router-dom'
import Auth from './auth/Auth'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Posts } from './components/Blogs'
import { CreatePost } from './components/CreateBlog'
import { EditPost } from './components/EditBlog'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {this.props.auth.isAuthenticated() && (
          <Menu.Item name="myPosts">
            <Link to="/myPosts">My Blogs</Link>
          </Menu.Item>
        )}

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <Posts key="allPosts" {...props} userPosts={false} auth={this.props.auth} />
          }}
        />

        <Route
          path="/myPosts"
          exact
          render={(props) => {
            return <Posts key="myPosts" {...props} userPosts={true} auth={this.props.auth} />
          }}
        />

        <Route
          path="/posts/create"
          exact
          render={(props) => {
            return <CreatePost {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/posts/:postId/edit"
          exact
          render={(props) => {
            return <EditPost {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
