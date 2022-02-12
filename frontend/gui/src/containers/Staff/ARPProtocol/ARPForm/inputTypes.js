const inputTypes = (type) => {
  let input_type;
  switch (type) {
    case "enrollment":
    case "record":
      input_type = "number";
      break;
    case "career":
    case "president_id_card":
    case "secretary_id_card":
    case "vocal_id_card":
      input_type = "select";
      break;
    default:
      input_type = "text";
      break;
  }
  return input_type;
};

export default inputTypes;
