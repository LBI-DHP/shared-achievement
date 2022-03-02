import * as React from "react";
import { View } from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";

export default function SendMotivationMessageDialog({ hideDialog, visible }) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        {/* <Dialog.Title>Alert</Dialog.Title>  */}
        <Dialog.Content>
          {/* <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={(val) => console.log(val)}
            value={" "}
          /> */}
          <Paragraph>This is simple dialog</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
