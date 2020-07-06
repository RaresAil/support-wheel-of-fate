
module.exports = async (data) => {
  if (!Array.isArray(data)) {
    return 'The \'engineers\' array is required.';
  }

  const { mongoose } = process;
  const Engineer = mongoose.model('engineer');

  // Stergem vechia lista
  await Engineer.remove({});

  console.time('Generating working shifts');

  const weeks = 2;
  let shifts = [];
  let lastWeek = [];
  let lastDate;

  for (let w = 0; w < weeks; w++) {
    const shiftWeek = [...data];
    if (lastDate && lastDate instanceof Date) {
      lastDate.setDate(lastDate.getDate() + 1);
    }

    lastDate = process.loader.utils.DateUtil.getNextMonday(lastDate);
    let thisWeek = [];

    do {
      // Am generat cate o lista pentru fiecare saptamana in parte folosing algoritmul de amestecare Fisher–Yates
      for (let i = shiftWeek.length - 1; i > 0; i--) {
        const n = Math.floor(Math.random() * i);
        const temp = shiftWeek[n];
        shiftWeek[n] = shiftWeek[i];
        shiftWeek[i] = temp;
      }
      thisWeek = shiftWeek.slice(0, 2);
    } while (thisWeek.some((x) => lastWeek.indexOf(x) >= 0));

    lastWeek = shiftWeek.slice(shiftWeek.length - 2, shiftWeek.length);

    // Grupam angajatii pe zile
    shifts = [...shifts, shiftWeek.map((x, i) => {
      return {
        name: x,
        day: process.loader.utils.DateUtil.dateToOutputCDay(lastDate, parseInt(i / 2))
      }
    })];
  }

  console.timeEnd('Generating working shifts');

  // Adaugam operatiile de salvare a fiecarui angajat intr-o lista pentru a putea astepta dupa acestea.
  // Acest pas este necesar deoarece cu functie .forEach nu poti folosi await
  let executionsEng = [];
  data.forEach((name) => {
    const eng = new Engineer({
      name,
      shifts: shifts.map((week) => {
        return week.filter((info) => info.name === name).map((info) => info.day)[0];
      })
    });
    executionsEng = [...executionsEng, eng.save()];
  });

  // Asteptam sa se execute toate operatiunile de salvare.
  await Promise.all(executionsEng);

  return undefined;
};
