export const formatCash = (number) => {
  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};
