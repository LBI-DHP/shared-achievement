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

import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  containerPaddingTop: {
    padding: 20,
    marginTop: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  cardHeader: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  header: {
    color: "white",
    textTransform: "uppercase",
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    textAlign: "center",
  },

  surface: {
    elevation: 4,
    borderRadius: 5,
  },
  selectButton: {
    backgroundColor: "#3f5c7c",
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
  },
  selectButtonInactive: {
    backgroundColor: "#b3b7bb",
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
  },
  selectButtonText: {
    color: "white",
  },
  selectButtonGroup: {
    flexDirection: "row",
  },
});
