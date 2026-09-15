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
