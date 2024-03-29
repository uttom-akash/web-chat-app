import React, { Component } from "react";
import RootForm from "../form/RootForm";
import "../css/TextChat.css";

import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import SingleMessage from "./Message";

class TextChat extends Component {
  constructor(props) {
    super(props);
    this.overscanRowCount = 8;
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      this.overscanRowCount = 15 ^ this.overscanRowCount;
    }
  };
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
          {user.userEmail === msg.senderEmail ? (
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
    const { messages, onSend } = this.props;
    return (
      <section className="chat-screen">
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
                overscanRowCount={this.overscanRowCount}
              />
            )}
          </AutoSizer>
        </section>
        <RootForm onSend={onSend} className="write-area" />
      </section>
    );
  }
}

export default TextChat;
