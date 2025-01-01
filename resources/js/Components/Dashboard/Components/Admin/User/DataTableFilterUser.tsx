import {
  CheckCircledIcon,
  CircleBackslashIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

// Status styles dengan warna yang sesuai
export const roleStyles: Record<string, string> = {
  ['USER']: "bg-blue-500 hover:bg-blue-400 text-white",
  ['ADMIN']: "bg-amber-500 hover:bg-amber-400 text-white",
};

// Status dengan ikon dan warna yang sesuai
export const roleUsers = [
  {
    value: 'USER',
    label: "User",
    icon: CrossCircledIcon,
    color: roleStyles['USER'],
  },
  {
    value: 'ADMIN',
    label: "Admin",
    icon: CheckCircledIcon,
    color: roleStyles['ADMIN'],
  },
];
