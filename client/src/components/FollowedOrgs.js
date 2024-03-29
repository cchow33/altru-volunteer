import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const FollowedOrgs = () => {
  const navigate = useNavigate();
  const { mongoUser } = useContext(AuthContext);
  return (
    <div className="highlights">
      <div>
        <p className="highlights-heading">⭐ Followed Organizations</p>
        <p className="subtext">
          View the latest events from organizations you follow ...
        </p>
        <p>
          {mongoUser.ngos.map((ngo, idx) => (
            <div key={idx} className="followed-orgs">
              <p
                className="follow-ngo"
                onClick={() => navigate(`/ngo/${ngo._id}`)}
              >
                {ngo.name}
              </p>
              {ngo.events && ngo.events.length > 0 && (
                <div
                  className="follow-event"
                  onClick={() => navigate(`/ngo/${ngo._id}`)}
                >
                  <p className="one-event">{ngo.events[0].name}</p>
                  <p className="one-event">{ngo.events[0].date}</p>
                </div>
              )}
            </div>
          ))}
        </p>
      </div>
    </div>
  );
};

export default FollowedOrgs;
