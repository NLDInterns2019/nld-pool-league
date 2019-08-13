import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton
} from "react-accessible-accordion";
import { uniqBy, orderBy } from "lodash";

import backend from "../../api/backend";

import "../../accordion.css";

import Axios from "axios";

const EditScoreForm = () => {
    return(
        <Accordion allowZeroExpanded={true}>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                    A
                </AccordionItemButton>
              </AccordionItemHeading>

            </AccordionItem>
          );
      </Accordion>
    )
}

export default EditScoreForm;