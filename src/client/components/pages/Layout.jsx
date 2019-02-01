import React, { Component } from "react";
import axios from "axios";
import RootForm from "../form/RootForm";
import Credentials from "../form/ConnectCredentials";
import getSocket from "../socket/Socket";
import SingleMessage from "./Message";
import { Card, CardBody, CardHeader, CardFooter } from "reactstrap";
import Vdo from "./VdoChat";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";

class Layout extends Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      receiver: "",
      sender: ""
    };

    this.listRef = React.createRef();
  }

  //Cell mesearer cache
  cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  //initialize
  initSocket = (receiver, sender) => {
    this.socket = getSocket(receiver, sender, this.addMessage);
    this.socket.on("message", msg => this.addMessage(msg));
  };

  //adding message

  addMessage = message => {
    const messages = this.state.messages;

    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.sender = this.state.sender;
    console.log(messageObject);
    this.socket.emit("message", messageObject);
    this.addMessage(messageObject);
    // axios
    //   .post("/api/save-message", { data: msgObj })
    //   .catch(error => console.log(error));
  };

  onSet = ev => {
    ev.preventDefault();
    const { receiver, sender } = this.state;

    this.initSocket(receiver, sender);
    //get last 10 message
    axios
      .post("/api/get-message", {
        data: {
          receiver,
          sender
        }
      })
      .then(res => this.setState({ messages: res.data.messages }))
      .catch(error => console.log(error));
  };

  onChange = ev => this.setState({ [ev.target.name]: ev.target.value });

  rowRenderer = ({ index, key, parent, style }) => {
    const msg = this.state.messages[index];
    console.log(this.state.sender, msg.sender);

    return (
      <CellMeasurer
        key={key}
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          {this.state.sender === msg.sender ? (
            <SingleMessage msg={msg} me={true} />
          ) : (
            <SingleMessage msg={msg} me={false} />
          )}
        </div>
      </CellMeasurer>
    );
  };

  //render
  render() {
    //component
    return (
      <div>
        <div style={{ float: "left" }} />
        <Card style={{ width: `${50}%`, float: "right" }}>
          <CardHeader>
            <Vdo
              sender={this.state.sender}
              receiver={this.state.receiver}
              audio={true}
              video={false}
              btn={"audio call"}
            />
            <Vdo
              sender={this.state.sender}
              receiver={this.state.receiver}
              audio={true}
              video={true}
              btn={"video call"}
            />
          </CardHeader>
          <CardBody
            style={{
              width: `${100}%`,
              height: "500px",
              backgroundColor: "#F8F8FF"
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  scrollToIndex={this.state.messages.length - 1}
                  ref={this.listRef}
                  height={height}
                  rowCount={this.state.messages.length}
                  deferredMeasurementCache={this.cache}
                  rowHeight={this.cache.rowHeight}
                  rowRenderer={this.rowRenderer}
                  width={width}
                  overscanRowCount={5}
                  scrollToRow={this.state.messages.length}
                />
              )}
            </AutoSizer>
          </CardBody>

          <CardFooter>
            <RootForm onSend={this.onSend} />
          </CardFooter>
        </Card>
        <Credentials
          onChange={this.onChange}
          receiver={this.state.receiver}
          sender={this.state.sender}
          onSubmit={this.onSet}
        />
      </div>
    );
  }
}

export default Layout;
