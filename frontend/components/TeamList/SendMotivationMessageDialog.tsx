import * as React from "react";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import dataManager from "../DataManager";

export default function SendMotivationMessageDialog({
  hideDialog,
  isVisible,
  nameTo,
  expoTokenList,
  nameFrom,
}) {
  const [message, setMessage] = React.useState("");

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph style={{ paddingBottom: 10 }}>
            Send {nameTo} a motivating message:
          </Paragraph>
          <TextInput
            autoComplete={false}
            value={message}
            multiline={false}
            placeholder="You can do it!"
            onChangeText={(text) => setMessage(text)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
              setMessage("");
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={message.length < 1}
            onPress={() => {
              hideDialog();
              expoTokenList.forEach((token) => {
                dataManager
                  .sendPushNotification(token, message, nameFrom)
                  .then((success) => {
                    if (success) {
                      setMessage("");
                      hideDialog();
                    }
                  });
              });
            }}
          >
            Send
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
