import React, { Component } from "react";
import RootForm from "../form/RootForm";
import ChatBoxHeader from "./ChatBoxHeader";

import "../css/Chatbox.css";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import SingleMessage from "./Message";
class ChatBox extends Component {
  cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  rowRenderer = ({ index, key, parent, style }) => {
    const { user, receiver, messages } = this.props;
    const msg = messages[index];

    return (
      <CellMeasurer
        key={key}
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          {user.userEmail === msg.sender ? (
            <SingleMessage
              msg={msg}
              owner={user.userProfilePicture}
              me={true}
            />
          ) : (
            <SingleMessage
              msg={msg}
              owner={receiver.receiverProfilePicture}
              me={false}
            />
          )}
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const {
      messages,
      user,
      receiver,
      onSend,
      backward,
      forward,
      onGetSocket
    } = this.props;
    return (
      <section className="chat-screen">
        <ChatBoxHeader
          sender={user.userEmail}
          receiver={receiver.receiverEmail}
          receiverName={receiver.receiverName}
          backward={backward}
          forward={forward}
          onGetSocket={onGetSocket}
        />
        <section className="messages">
          <AutoSizer>
            {({ height, width }) => (
              <List
                scrollToIndex={messages.length - 1}
                height={height}
                rowCount={messages.length}
                deferredMeasurementCache={this.cache}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.rowRenderer}
                width={width}
                overscanRowCount={5}
              />
            )}
          </AutoSizer>
        </section>
        <RootForm onSend={onSend} />
      </section>
    );
  }
}

export default ChatBox;
