import React from "react";
import { WebView } from "react-native-webview";

export default function MyWeb() {
  return (
    <WebView
      source={{
        uri: "https://github.com/facebook/react-native",
      }}
      style={{ marginTop: 20, backgroundColor: "red", height: 500 }}
    />
  );
}
