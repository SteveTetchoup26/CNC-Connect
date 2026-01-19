/* eslint-disable @typescript-eslint/no-explicit-any */
// classifyConcours.ts
import { RUBRIQUES } from "./concoursRubriques";

export const classifyConcours = (concours: any[]) => {
  const result: Record<string, any[]> = {};
  const usedIds = new Set<number>();

  RUBRIQUES.forEach((r) => (result[r.key] = []));

  concours.forEach((c) => {
    const label = c.libelle_concours?.toLowerCase() || "";
    let matched = false;

    RUBRIQUES.forEach((r) => {
      if (r.keywords.some((k) => label.includes(k))) {
        result[r.key].push(c);
        usedIds.add(c.id);
        matched = true;
      }
    });

    if (!matched) {
      result["others"] = result["others"] || [];
      result["others"].push(c);
    }
  });

  return result;
};
