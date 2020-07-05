
module.exports = async (data) => {
  if (!Array.isArray(data)) {
    return 'The \'engineers\' array is required.';
  }

  const { mongoose } = process;
  const Engineer = mongoose.model('engineer');

  // Remove the old list.
  await Engineer.remove({});

  console.time('Generating working shifts');

  const weeks = 2;
  let shifts = [];
  let lastWeek;
  let lastDate;

  for (let w = 0; w < weeks; w++) {
    const shiftWeek = [...data];
    if (lastDate && lastDate instanceof Date) {
      lastDate.setDate(lastDate.getDate() + 1);
    }

    lastDate = process.loader.utils.DateUtil.getNextMonday(lastDate);// I added a do-while to ensure that an engineer don't work 2 consecutive days.
    do {
      // We generate a random list using the Fisher–Yates shuffle algorithm.
      for (let i = shiftWeek.length - 1; i > 0; i--) {
        const n = Math.floor(Math.random() * i + 1);
        const temp = shiftWeek[n];
        shiftWeek[n] = shiftWeek[i];
        shiftWeek[i] = temp;
      }
    } while (lastWeek === shiftWeek[shiftWeek.length - 1]);
    lastWeek = shiftWeek[shiftWeek.length - 1];

    // We set the working day for each engineer
    shifts = [...shifts, shiftWeek.map((x, i) => {
      return {
        name: x,
        day: process.loader.utils.DateUtil.dateToOutputCDay(lastDate, parseInt(i / 2))
      }
    })];
  }

  console.timeEnd('Generating working shifts');

  // Add all the operations to a list to wait for them later.
  // This step is required because you cannot use await inside .forEach
  let executions = [];
  data.forEach((name) => {
    const eng = new Engineer({
      name,
      shifts: shifts.map((week) => {
        return week.filter((info) => info.name === name).map((info) => info.day)[0];
      })
    });
    executions = [...executions, eng.save()];
  });

  // Wait to complete all the operations from the "executions" list.
  await Promise.all(executions);
  return undefined;
};
