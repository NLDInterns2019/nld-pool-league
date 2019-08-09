import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton
} from "react-accessible-accordion";
import { uniqBy, orderBy } from "lodash";

import backend from "../../api/backend";

import SeasonItemPanel from "./SeasonItemPanel";

import "../../accordion.css";

import Axios from "axios";

class SeasonAccordion extends React.Component {
  state = {
    type: "",
    staffName: " ",
    unplayedSeasons: []
  };

  signal = Axios.CancelToken.source();

  getUnplayedSeasons = async () => {
    const result = await backend.get("/api/89ball_fixture/all/", {
      cancelToken: this.signal.token,
      params: {
        type: this.state.type,
        staffName: this.state.staffName,
        hidePlayed: true
      }
    });
    this.setState({
      unplayedSeasons: orderBy(
        uniqBy(result.data, "seasonId"),
        ["seasonId"],
        ["desc"]
      )
    });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.type });
    await this.setState({ staffName: this.props.staffName });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.staffName !== this.props.staffName) {
      await this.setState({ staffName: this.props.staffName });
      this.getUnplayedSeasons();
    }
  };

  render() {
    if (!this.state.unplayedSeasons.length) {
      return (
        <div className="unplayedTitle">
          <h4>
            You have no unplayed fixtures for <b>{this.state.type}-ball</b>
          </h4>
        </div>
      );
    }
    return (
      <div className="unplayed-accordian">
        {this.state.type === "8" ? (
          <div className="unplayedTitle">
            <h4>
              Unplayed <strong>8-Ball</strong> Fixtures
            </h4>
          </div>
        ) : (
          <div className="unplayedTitle">
            <h4>
              Unplayed <strong>9-Ball</strong> Fixtures
            </h4>
          </div>
        )}
        <span
          className={`${this.state.type}-ball-icon`}
          alt={`${this.state.type}-ball`}
        />
        <Accordion allowZeroExpanded={true}>
          {this.state.unplayedSeasons.map(season => {
            return (
              <AccordionItem key={season.seasonId}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    Season {season.seasonId}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <SeasonItemPanel
                  type={this.state.type}
                  staffName={this.state.staffName}
                  seasonId={season.seasonId}
                />
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }
}

export default SeasonAccordion;
