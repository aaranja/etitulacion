export const updateObject = (oldObject, updateProperties) => {
  return {
    ...oldObject,
    ...updateProperties,
  };
};

export const isLogged = (token) => {
  return token !== undefined;
};
