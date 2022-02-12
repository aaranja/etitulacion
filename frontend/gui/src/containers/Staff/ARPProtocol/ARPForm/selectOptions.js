export const careerOptions = [
  { label: "Ingeniería Electromecánica", value: "electromecanica" },
  { label: "Ingeniería Electrónica", value: "electronica" },
  { label: "Ingeniería en Gestión Empresarial", value: "gestion" },
  { label: "Ingeniería Industrial", value: "industrial" },
  { label: "Ingeniería Mecatrónica", value: "mecatronica" },
  {
    label: "Ingeniería en Sistemas Computacionales",
    value: "sistemas",
  },
  { label: "Licenciatura en Administración", value: "administracion" },
];

export const staffStructureOptions = (data, option) => {
  console.log(data);
  let options = [];
  for (let i in data) {
    options.push({ label: data[i][option], value: data[i].key });
  }
  return options;
};
