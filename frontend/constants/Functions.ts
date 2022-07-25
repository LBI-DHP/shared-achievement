export function getDateStringYesterday() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() - 1);
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  let dateString = date.toString();
  if (dateString.length === 1) dateString = "0" + dateString;
  let monthString = month.toString();
  if (monthString.length === 1) monthString = "0" + monthString;
  const dateStringYesterday = year + "-" + monthString + "-" + dateString;
  return dateStringYesterday;
}
