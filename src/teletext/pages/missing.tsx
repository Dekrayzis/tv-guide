import { GENERAL_FASTEXT, INDEX, type Page } from "./shared";

/** Any page number that isn't in service. */
export function missingPage(number: number): Page {
  return {
    title: `Page ${number}`,
    colour: "white",
    info: "",
    subpages: [
      <div key="missing" className="tt-missing">
        <p>Page {number} is not in service.</p>
        <p className="tt-cyan">The TV index is on page {INDEX}.</p>
      </div>,
    ],
    fastext: GENERAL_FASTEXT,
  };
}
