export const format = function () {
  var i = 1,
    args = arguments;
  return args[0].replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};
