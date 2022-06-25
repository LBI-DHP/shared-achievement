import * as React from "react";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";

export default function YesterdaysProgressPopUp({
  isYesterdaysProgressPopUpVisible,
  setIsYesterdaysProgressPopUpVisible,
  yesterdaysProgress,
  mode,
  yesterdaysSteps,
}) {
  return (
    <Portal>
      <Dialog visible={isYesterdaysProgressPopUpVisible}>
        <Dialog.Content>
          <Paragraph style={{ paddingBottom: 10 }}>
            {yesterdaysProgress >= 100 ? (
              <>Well done!👏Your team made it to the summit yesterday.🥳🎉 </>
            ) : (
              <>
                Unfortunately, your team did not make it to the summit
                yesterday.{" "}
              </>
            )}
            {mode === "ABSOLUTE" ? (
              <>
                You made it up {yesterdaysProgress}% and collected{" "}
                {yesterdaysSteps} steps. ⛰️
              </>
            ) : (
              <>You made it up {yesterdaysProgress}%. ⛰️</>
            )}
            {yesterdaysProgress < 100 && (
              <> Try it again today. You can do it. 💪</>
            )}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsYesterdaysProgressPopUpVisible(false)}>
            Okay
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
