import React, { Component } from "react";
import PropTypes from "prop-types";

import Tile from "./Tile";
import OwnTile from "./OwnTile";

class Tiles extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      participants,
      toggleMicrophone,
      isWidgetFullScreenOn,
      kickParticipant,
      isAdmin,
      isAdminActived,
      currentUser,
      isWebinar,
      dolbyVoiceEnabled,
    } = this.props;
    let tilesParticipants = participants.filter(
        (p) => p.isConnected && p.type == "user"
    );
    let videoParticipants = tilesParticipants.filter(
        (p) => p.isConnected && p.type == "user" &&
            ((p.stream !== null) &&
                (p.stream.active) &&
                (p.stream.getVideoTracks().length > 0)
            )
    );
    let hasVideoParticipants = videoParticipants && videoParticipants.length>0;
    let IHaveVideo = (!currentUser || (currentUser.stream && currentUser.stream.getVideoTracks().length > 0));
    if(hasVideoParticipants || IHaveVideo)
      tilesParticipants = videoParticipants;
    let showOwnTile = ((!isWebinar && !currentUser.isListener) ||
        (isWebinar && isAdmin)) &&
        (IHaveVideo || !hasVideoParticipants);

    let nbParticipants = tilesParticipants.length;
    if (showOwnTile)
      nbParticipants += 1;

    let count = -1;
    return (
      <div
        className="SidebarTiles"
        data-number-user={nbParticipants <= 16 ? nbParticipants : 16}
      >
        <div className={"tiles-list list" + nbParticipants}>
          { showOwnTile && (
            <OwnTile
              participant={currentUser}
              isAdminActived={isAdminActived}
              mySelf={true}
              nbParticipant={++count}
              kickParticipant={kickParticipant}
              isAdmin={isAdmin}
              toggleMicrophone={toggleMicrophone}
              isWidgetFullScreenOn={isWidgetFullScreenOn}
              dolbyVoiceEnabled={dolbyVoiceEnabled}
            />
          )}
          {tilesParticipants.map((participant, i) => {
            count = count + 1;
            return (
              <Tile
                participant={participant}
                nbParticipant={count}
                mySelf={false}
                isAdminActived={isAdminActived}
                key={i}
                kickParticipant={kickParticipant}
                isAdmin={isAdmin}
                toggleMicrophone={toggleMicrophone}
                isWidgetFullScreenOn={isWidgetFullScreenOn}
                dolbyVoiceEnabled={dolbyVoiceEnabled}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

Tiles.propTypes = {
  participants: PropTypes.array.isRequired,
  toggleMicrophone: PropTypes.func.isRequired,
  isWidgetFullScreenOn: PropTypes.bool.isRequired,
  isWebinar: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  kickParticipant: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAdminActived: PropTypes.bool.isRequired,
  dolbyVoiceEnabled: PropTypes.bool,
};

export default Tiles;
