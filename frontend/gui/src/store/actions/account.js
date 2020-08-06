import axios from "axios";

export const updateSuccess = (name) => {
  return {
    all_name: name,
  };
};

export const accountUpdate = (
  first_name,
  last_name,
  enrollment,
  career,
  gender,
  titulation_type
) => {
  //console.log(first_name, last_name, enrollment, career, gender, titulation_type);
  var token = localStorage.getItem("token");
  var account = { first_name: first_name, last_name: last_name };
  //console.log(account)
  return (dispatch) => {
    //console.log(account);
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .put(`http://127.0.0.1:8000/api/account/${enrollment}/`, {
        career: career,
        gender: gender,
        titulation_type: titulation_type,
        account: account,
      })
      .then((res) => {
        //console.log(res.data);
        var nom =
          res.data.account["first_name"] + " " + res.data.account["last_name"];
        localStorage.setItem("all_name", nom);
        dispatch(updateSuccess(token));
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };
};
