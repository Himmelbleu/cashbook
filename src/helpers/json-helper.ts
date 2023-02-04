import { Bill } from "../types/data-type";

export function searchBillByYearMont(months: number[], year: number, bills: Bill[]): Bill[] {
  const result: Bill[] = [];
  for (let index = 0; index < bills.length; index++) {
    const mont = months.find(el => el == bills[index].month);
    const bill = bills.find(el => el.month == mont && el.year == year);
    bill && result.push(bill);
  }
  return result;
}

export function searchBillByYear(year: number, bills: Bill[]): Bill[] {
  const result: Bill[] = [];
  bills.forEach(ele => {
    if (ele.year == year) {
      result.push(ele);
    }
  });
  return result;
}

export function descend(bills: Bill[], callback?: Function) {
  bills.sort((a, b) => {
    return Number(b.month) - Number(a.month);
  });
  callback && callback();
}

export function ascend(bills: Bill[], callback?: Function) {
  bills.sort((a, b) => {
    return Number(a.month) - Number(b.month);
  });
  callback && callback();
}
