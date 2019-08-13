import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";
import "../../accordion.css";
import "./SubmitScoreForm";
import SubmitScoreForm from "./SubmitScoreForm";

const EditScoreForm = props => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <Accordion allowZeroExpanded={true}>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton
              style={{
                fontWeight: "bold",
                color: "white",
                backgroundColor: "#e23e4b",
                margin: "auto",
                width: "600px"
              }}
            >
              Edit Submitted Result
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <SubmitScoreForm
              players={props.players}
              type={props.type}
              changeFixtureScore={props.changeFixtureScore}
              editFixtureScore={props.editFixtureScore}
              activeSeason={props.activeSeason}
              edit={true}
            />
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EditScoreForm;
