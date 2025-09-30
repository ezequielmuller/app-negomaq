export const formatDate = (date: string): string => {
  return date != null ? date.split('-').reverse().join('-') : date;
};
export default formatDate;
