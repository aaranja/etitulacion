import React from "react";
import { jsPDF } from "jspdf";

// Default export is a4 paper, portrait, using millimeters for units
const createDoc = () => {
  const doc = new jsPDF("p", "mm", "letter");
  const paragraph =
    "Apple's iPhone 7 is officially upon us. After a week of pre-orders, the latest in the iPhone lineup officially launches today.\n\nEager Apple fans will be lining up out the door at Apple and carrier stores around the country to grab up the iPhone 7 and iPhone 7 Plus, while Android owners look on bemusedly.\n\nDuring the Apple Event last week, the tech giant revealed a number of big, positive changes coming to the iPhone 7. It's thinner. The camera is better. And, perhaps best of all, the iPhone 7 is finally water resistant.\n\nStill, while there may be plenty to like about the new iPhone, there's plenty more that's left us disappointed. Enough, at least, to make smartphone shoppers consider waiting until 2017, when Apple is reportedly going to let loose on all cylinders with an all-glass chassis design.";
  doc.setFontSize(9);
  // doc.text(paragraph, 10, 10);
  doc.html(
    <p>
      Apple's iPhone 7 is officially upon us. After a week of pre-orders, the
      latest in the iPhone lineup officially launches today.
    </p>,
    { align: "justify" }
  );
  doc.save("a4.pdf");
};

export default createDoc;
