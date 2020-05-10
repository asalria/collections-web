import React, { useState } from "react";
import styled from "styled-components";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { AuthContext } from "./../contexts/AuthContext";

import AuthService from "./../services/AuthService";

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
`;

const LoginDialog = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnChangeEmail = e => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = e => {
    setPassword(e.target.value);
  };

  return (
    <AuthContext.Consumer>
      {context => {
        const { onUserChange, user } = context;
        const handleLogin = e => {
          if (!loading) {
            try {
              setLoading(true);
              AuthService.login({ email, password }).then(
                user => {
                  onUserChange(user.data);
                  props.handleClose();
                  setLoading(false);
                },
                err => console.log(err)
              );
            } catch (err) {
              alert(err); // TypeError: failed to fetch
            }
          }
        };

        return (
          <div>
            <Dialog
              open={props.isOpen}
              onClose={props.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Login</DialogTitle>
              <StyledDialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  onChange={handleOnChangeEmail}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="passoword"
                  label="Password"
                  type="password"
                  onChange={handleOnChangePassword}
                />
              </StyledDialogContent>
              <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleLogin} color="primary">
                  Send
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default LoginDialog;