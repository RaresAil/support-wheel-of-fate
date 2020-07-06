
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
  let lastWeek;
  let lastDate;

  for (let w = 0; w < weeks; w++) {
    const shiftWeek = [...data];
    if (lastDate && lastDate instanceof Date) {
      lastDate.setDate(lastDate.getDate() + 1);
    }

    // Am adaugat un do-while pentru a elimina riscul de a lucra in zile consecutive
    lastDate = process.loader.utils.DateUtil.getNextMonday(lastDate);
    do {
      // Am generat cate o lista pentru fiecare saptamana in parte folosing algoritmul de amestecare Fisher–Yates
      for (let i = shiftWeek.length - 1; i > 0; i--) {
        const n = Math.floor(Math.random() * i + 1);
        const temp = shiftWeek[n];
        shiftWeek[n] = shiftWeek[i];
        shiftWeek[i] = temp;
      }
    } while (lastWeek === shiftWeek[shiftWeek.length - 1]);
    lastWeek = shiftWeek[shiftWeek.length - 1];

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
