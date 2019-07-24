import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth0Client from "../Auth";
import backend from "../api/backend";
import SubNavBar from "./nav/SubNavBar.js";
import Header from "./nav/Header.js";
import "../App.css";
import { Link } from "react-router-dom";

import CreateSeasonForm from "./season/CreateSeasonForm.js";
import SeasonsList from "./season/SeasonsList.js";

const { WebClient } = require("@slack/web-api");


class HoFPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type: "",
          seasons: [],
          latestSeason: null
        };
    
      }
    
    
      getSeasonsList = async () => {
        const response = await backend.get("/api/89ball_season", {
          params: {
            type: this.state.type
          }
        });
        this.setState({ seasons: response.data });
      };
    
      componentDidMount = async () => {
        await this.setState({ type: this.props.match.params.type });
        this.getSeasonsList();
      };
    
      componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.match.params.type !== prevProps.match.params.type) {
          await this.setState({ type: this.props.match.params.type });
          this.getSeasonsList();
        }
      };
    
      createSeason = async state => {
        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth0Client.getIdToken()}`
          };
    
          await backend.post(
            "/api/89ball_league/add/players",
            {
              type: parseInt(this.state.type),
              seasonId: parseInt(state.seasonName),
              staffs: state.players
            },
            {
              headers: headers
            }
          );
    
          await backend
            .post(
              "/api/89ball_fixture/generate/",
              {
                type: parseInt(this.state.type),
                seasonId: parseInt(state.seasonName)
              },
              {
                headers: headers
              }
            )
            .then(() => {
              this.toastSuccess("Season Created");
              this.getSeasonsList();
              this.getLatestSeason();
              this.postCreateSeasonSlackMessage(this.state.type, state.seasonName);
            });
        } catch (e) {
          if (e.response.status === 401) {
            this.toastUnauthorised();
          }
        }
      };
    
      deleteSeason = async id => {
        await backend
          .delete("/api/89ball_season/delete/", {
            data: {
              type: parseInt(this.state.type),
              seasonId: parseInt(id)
            },
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          })
          .then(() => {
            this.toastSuccess("Deleted");
            this.getSeasonsList();
            this.getLatestSeason();
          })
          .catch(e => {
            if (e.response.status === 401) {
              this.toastUnauthorised();
            }
          });
      };
    
      toastUnauthorised = () => {
        toast.error("⛔ Unauthorised! Please login", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      };
    
      toastSuccess = message => {
        toast.success(`✅ ${message}!`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      };
    
      render() {
        return (
          <div id="seasons">
            <ToastContainer />
            <Header />
            <SubNavBar
              latestSeason={this.state.latestSeason}
              type={this.state.type}
            />
            <div className="content">
              <div id="seasonsListContainer">
                <SeasonsList
                  type={this.state.type}
                  seasons={this.state.seasons}
                  deleteSeason={this.deleteSeason}
                />
                <br />
                
              </div>
              
            </div>
          </div>
        );
      }
}

export default withRouter(HoFPage);
