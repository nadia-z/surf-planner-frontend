import React from "react";
import Guest from "../Guest/Guest"
import "./nonParticipatingGuests.css";

const NonParticipatingGuests = ({ non_participating_guests = [], onAddGuest, group }) => {

  if (non_participating_guests.length === 0) {
    return <p>No guests available</p>;
  }
  return(
  <div className="guest-list"><p>Non-participating guests:</p>

    <ul aria-label='non-participating guests'>
          {non_participating_guests.map((guest) => (
            <Guest key={guest.id} student={guest} onClick={(guest) => onAddGuest(guest, group)}/>
          ))}
        </ul>
  </div>
)};

export default NonParticipatingGuests;
