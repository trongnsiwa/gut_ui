export const format = function () {
  var i = 1,
    args = arguments;
  return args[0].replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const lowerCaseString = (string) => {
  return string.toString().toLowerCase();
};
