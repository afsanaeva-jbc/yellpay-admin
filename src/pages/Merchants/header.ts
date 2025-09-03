export const merchantHeader = (t: (key: string) => string) => [
  { id: "name", label: t("merchant-name"), align: "left", width: "30%" },
  { id: "businessType", label: t("business-type"), align: "left", width: "25%" },
  { id: "email", label: t("email"), align: "left", width: "25%" },
  { id: "status", label: t("status"), align: "left", width: "20%" },
  { id: "actions", label: t("action"), align: "center", width: "10%", hideHeader: false },
] as {
  id: string;
  label: string;
  align: "left" | "right" | "center";
  hideHeader?: boolean;
  width?: string;
}[];
