import type { BankTransferOption, RegistryOption } from "@/types";

export const registryOptions: RegistryOption[] = [
  {
    title: "Gift Registry",
    description:
      "A curated Amazon wedding registry for guests who would like to choose something beautiful and practical for our new home.",
    buttonLabel: "Open Amazon Registry",
    href: "https://www.amazon.co.uk/wedding/guest-view/UTLGZL860VDT",
    icon: "gift",
  },
  {
    title: "Bank Transfer",
    description:
      "For guests who prefer a direct blessing, transfer details are available below in pounds and naira.",
    buttonLabel: "View transfer details",
    href: "#",
    icon: "bank",
  },
  {
    title: "Cash Gift",
    description:
      "For guests who prefer to give in person, a tasteful cash gift option will be available at the reception.",
    buttonLabel: "View details",
    href: "#",
    icon: "heart",
  },
];

export const amazonRegistry = {
  href: "https://www.amazon.co.uk/wedding/guest-view/UTLGZL860VDT",
  title: "Amazon Gift Registry",
  description:
    "A thoughtful edit of home, hosting, and everyday pieces as we begin this new chapter together.",
};

export const bankTransferOptions: BankTransferOption[] = [
  {
    currency: "POUNDS",
    label: "UK Bank Transfer",
    accountName: "Olutayo Oladeinbo",
    bankName: "Lloyds Bank",
    accountNumber: "80698368",
    sortCode: "77-71-43",
    note: "For guests blessing us in pounds.",
  },
  {
    currency: "NAIRA",
    label: "Naira Transfer",
    accountName: "OLADEINBO OLUTAYO TOSIN",
    bankName: "GTB",
    accountNumber: "0429174024",
    note: "For guests blessing us in naira.",
  },
];
