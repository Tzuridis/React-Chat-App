import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatManager, TokenProvider } from '@pusher/chatkit';

const instanceLocator = "v1:us1:195e76e6-5514-4e96-8ae5-5d8f195d6a8e"
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/195e76e6-5514-4e96-8ae5-5d8f195d6a8e/token"
const username = "Ted"
const roomId = 17819406

class App extends Component {
    constructor() {
        super()
        this.state = {
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    } 
    
    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: instanceLocator,
            userId: username,
            tokenProvider: new TokenProvider({
                url: testToken
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onNewMessage: message => {

                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
      })
    }
    
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: roomId
        })
    }
    
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Hello world!
          </p>
          
        </header>
        <Title />
        <MessageList roomId={this.state.roomId}
        messages={this.state.messages} />
        <SendForm 
        sendMessage={this.sendMessage} />

      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
      return (
          <ul className="message-list">
              {this.props.messages.map((message, index) => {
                  return (
                    <li  key={message.id} className="message">
                      <div>{message.senderId}</div>
                      <div>{message.text}</div>
                    </li>
                  )
              })}
          </ul>
      )
  }
}

class SendForm extends React.Component {
  constructor() {
      super()
      this.state = {
          message: ''
      }
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  handleChange(e) {
      this.setState({
          message: e.target.value
      })
  }
  
  handleSubmit(e) {
      e.preventDefault()
      this.props.sendMessage(this.state.message)
      this.setState({
          message: ''
      })
  }
  
  render() {
      return (
          <form
              onSubmit={this.handleSubmit}
              className="send-form">
              <input
                  onChange={this.handleChange}
                  value={this.state.message}
                  placeholder="Type your message and hit ENTER"
                  type="text" />
          </form>
      )
  }
}

function Title() {
return <p className="title">LaterPay Interview Chat</p>
}
 
export default App;