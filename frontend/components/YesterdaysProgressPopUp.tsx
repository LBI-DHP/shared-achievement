/*
 * Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
 *
 * Licensed under the Apache License, Version 2.0 with the Commons Clause License
 * Condition v1.0 (the "License"); you may not use this file except in compliance
 * with the License. A copy of the License is distributed in the LICENSE file at
 * the root of this repository; the Apache License is also available at
 * http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
 * https://commonsclause.com/
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause
 */

import * as React from "react";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";

export default function YesterdaysProgressPopUp({
  isYesterdaysProgressPopUpVisible,
  setIsYesterdaysProgressPopUpVisible,
  yesterdaysProgress,
  mode,
  yesterdaysSteps,
  isSingleUser = false,
}) {
  return (
    <Portal>
      <Dialog visible={isYesterdaysProgressPopUpVisible}>
        <Dialog.Content>
          <Paragraph style={{ paddingBottom: 10 }}>
            {isSingleUser ? (
              <>
                {yesterdaysProgress >= 100 ? (
                  <>Well done!👏 You made it to the summit yesterday.🥳🎉 </>
                ) : (
                  <>
                    Unfortunately, you did not make it to the summit yesterday.{" "}
                  </>
                )}
              </>
            ) : (
              <>
                {yesterdaysProgress >= 100 ? (
                  <>
                    Well done!👏 Your team made it to the summit yesterday.🥳🎉{" "}
                  </>
                ) : (
                  <>
                    Unfortunately, your team did not make it to the summit
                    yesterday.{" "}
                  </>
                )}
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
