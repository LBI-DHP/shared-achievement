import React from "react";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";

export default function GoogleFitInfoDialog({
  isGoogleInfoPopUpVisible,
  setIsGoogleInfoPopUpVisible,
}) {
  return (
    <Portal>
      <Dialog visible={isGoogleInfoPopUpVisible}>
        <Dialog.Content>
          <Paragraph style={{ paddingBottom: 10 }}>
            Google Fit uploads your steps in irregular intervals to the cloud
            (approx. every 15min). 🕐
          </Paragraph>
          <Paragraph style={{ paddingBottom: 10 }}>
            Therefore, it may happen that steps that are already visible in your
            Google Fit app are not yet displayed here. As soon as Google has
            uploaded your steps to the cloud, they will also be visible here. 👣
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsGoogleInfoPopUpVisible(false)}>
            Okay
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
