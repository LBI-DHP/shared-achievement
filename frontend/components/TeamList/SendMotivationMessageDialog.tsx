import { useEffect, useState } from "react";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import { Text, View } from "react-native";
import dataManager from "../DataManager";
import { MaterialIcons } from "@expo/vector-icons";

export default function SendMotivationMessageDialog({
  hideDialog,
  isVisible,
  nameTo,
  expoTokenList,
  nameFrom,
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [wasMessageSentSuccessfully, setWasMessageSentSuccessfully] =
    useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setWasMessageSentSuccessfully(false);
      setError(false);
      setErrorCount(0);
    }
  }, [isVisible]);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph style={{ paddingBottom: 10 }}>
            Send {nameTo} a motivating message:
          </Paragraph>
          <TextInput
            value={message}
            multiline={false}
            placeholder="You can do it!"
            onChangeText={(text) => {
              if (!isLoading && !wasMessageSentSuccessfully) setMessage(text);
            }}
          />
          {error && (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: 2,
              }}
            >
              <MaterialIcons name="error-outline" size={24} color="red" />
              {expoTokenList.length === 1 ? (
                <Text> Message could not be sent.</Text>
              ) : (
                <Text> {errorCount} messages could not be sent.</Text>
              )}
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            disabled={isLoading || wasMessageSentSuccessfully}
            onPress={() => {
              hideDialog();
              setMessage("");
            }}
          >
            Cancel
          </Button>
          {wasMessageSentSuccessfully ? (
            <Button icon="check" color="green">
              Sent
            </Button>
          ) : (
            <Button
              disabled={message.length < 1}
              loading={isLoading}
              onPress={async () => {
                let counter = 0;
                setError(false);
                setIsLoading(true);
                for (const token of expoTokenList) {
                  const success = await dataManager.sendPushNotification(
                    token,
                    message,
                    nameFrom
                  );
                  if (!success) counter++;
                }
                if (counter === 0) {
                  setWasMessageSentSuccessfully(true);
                  setTimeout(() => {
                    hideDialog();
                    setMessage("");
                  }, 1500);
                } else {
                  setError(true);
                }
                setErrorCount(counter);
                setIsLoading(false);
              }}
            >
              Send
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
