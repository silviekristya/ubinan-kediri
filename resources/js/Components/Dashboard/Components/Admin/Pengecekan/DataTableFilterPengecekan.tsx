// resources/js/Components/Dashboard/Components/Pengecekan/FilterStyles.ts
import { InfoCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export const tahunStyles = {
  DEFAULT: "bg-orange-500 text-white hover:bg-orange-400",
};

export const subroundStyles: Record<string,string> = {
  "1": "bg-green-500    text-white hover:bg-green-400",
  "2": "bg-yellow-500  text-white hover:bg-yellow-400",
  "3": "bg-blue-500 text-white hover:bg-blue-400",
};

export const tahunOptions = (years: string[]) =>
  years.map((y) => ({
    value: y,
    label: y,
    // icon: CrossCircledIcon,
    color: tahunStyles.DEFAULT,
  }));

export const subroundOptions = (srs: string[]) =>
  srs
    .map((raw) => {
      const norm = String(Number(raw)); // strip leading zero
      return {
        value: raw,
        label: raw,
        // icon: CrossCircledIcon,
        color: subroundStyles[norm] ?? "bg-gray-100 text-gray-800",
      };
    })
    // dedupe in case you ever see both “1” and “01”
    .filter((opt, i, arr) => arr.findIndex(x => x.value === opt.value) === i);
