"use client";

import { Badge } from "@/components/ui/badge";
import { sourceTypeOptions } from "./dummy";

type Props = {
  value: number;
};

export default function SourceTypeBadge({ value }: Props) {
  const found = sourceTypeOptions.find((item) => item.value === value);

  return (
    <Badge variant="outline">
      {found ? found.label : `Unknown (${value})`}
    </Badge>
  );
}