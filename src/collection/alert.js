import React, { useState } from 'react';
import { UncontrolledAlert } from 'reactstrap';

export const Alert = (props) => {
  const [visible, setVisible] = useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <div>
      <Alert color="primary" isOpen={this.props.alert} toggle={onDismiss} fade={false}>
        I am a primary alert and I can be dismissed without animating!
      </Alert>
      </div>
  );
}

export function UncontrolledAlertFadelessExample() {
  return (
    <div>
      <UncontrolledAlert color="info" fade={false}>
        I am an alert and I can be dismissed without animating!
      </UncontrolledAlert>
    </div>
  );
}