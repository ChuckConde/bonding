import { ValidatorFn, FormGroup } from "@angular/forms";

export function dateLessThan(from: string, to: string): ValidatorFn {
  return (group: FormGroup): {[key: string]: any} | null => {
    const fromValue = group.controls[from].value.replace(':', '');
    const toValue = group.controls[to].value.replace(':', '');

    if (fromValue && toValue && fromValue > toValue) {
      return { dates: true }
    } else {
      return null;
    }
  };
}
