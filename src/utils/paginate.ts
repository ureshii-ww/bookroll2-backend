export default function (array: Array<any>, page: number, size: number): Array<any> {
  return array.slice((page - 1) * size, page * size);
}