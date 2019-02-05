import React, { Component } from "react";
import RootForm from "../form/RootForm";
import Vdo from "./VdoChat";
import Upload from "../form/UploadForm";
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
    const { sender, messages } = this.props;
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
          {sender === msg.sender ? (
            <SingleMessage msg={msg} me={true} />
          ) : (
            <SingleMessage msg={msg} me={false} />
          )}
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const { messages, sender, receiver, onSend, onToggler } = this.props;
    return (
      <div className="full-screen">
        <section className="chat-screen">
          <section className="optional">
            <Upload className="btn" />
            <div className="btn">
              <i className="fa fa-download" />
            </div>

            <button onClick={onToggler} className="btn">
              <i className="fas fa-arrow-left" />
            </button>
            <Vdo
              sender={sender}
              receiver={receiver}
              audio={true}
              video={false}
              btn="fa fa-phone"
            />
            <Vdo
              sender={sender}
              receiver={receiver}
              audio={true}
              video={true}
              btn="fa fa-video-camera"
            />
          </section>

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
      </div>
    );
  }
}

export default ChatBox;