import React from "react";
import { Card, Button, Input, Form, FormGroup, Label } from "reactstrap";

export default props => {
  return (
    <Card style={{ width: `${40}%` }}>
      <Form style={{ padding: "15px" }} onSubmit={props.onSubmit}>
        <FormGroup>
          <Label for="receiver">Receiver</Label>
          <Input
            type="email"
            name="receiver"
            value={props.receiver}
            onChange={props.onChange}
            placeholder="receiver email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="sender">Sender</Label>
          <Input
            type="email"
            name="sender"
            value={props.sender}
            onChange={props.onChange}
            placeholder="sender email"
          />
        </FormGroup>
        <Button outline color="success">
          Set
        </Button>
      </Form>
    </Card>
  );
};
