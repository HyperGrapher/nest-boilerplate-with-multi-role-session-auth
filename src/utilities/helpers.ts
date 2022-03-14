/*
Removes given item from the given array and returns the array with its type 
*/
function removeItemFromArray<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export default removeItemFromArray;
