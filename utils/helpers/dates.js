function getNextMonthDate(month) {
  const currentDate = new Date();
  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + month,
    8
  ).getTime();
  return nextMonth;
}

function getNextDaysDate(days) {
  const currentDate = new Date();
  const nextDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDay() + days
  ).getTime();
  return nextDay;
}

module.exports = { getNextDaysDate, getNextMonthDate };
