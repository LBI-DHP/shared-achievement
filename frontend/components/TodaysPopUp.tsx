import * as React from "react";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";

export default function TodaysPopUp({
  isTodaysPopUpVisible,
  setIsTodaysPopUpVisible,
  isSingleUser = false,
}) {
  return (
    <Portal>
      <Dialog visible={isTodaysPopUpVisible}>
        <Dialog.Content>
          <Paragraph style={{ paddingBottom: 10 }}>
            {isSingleUser ? (
              <>
                Well done!👏 You made it to the summit today. 🥳🎉 Keep
                collecting and contributing steps.
              </>
            ) : (
              <>
                Well done!👏 Your team made it to the summit today. 🥳🎉 Keep
                collecting and contributing steps.
              </>
            )}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsTodaysPopUpVisible(false)}>Okay</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
