import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import StripeCheckout from "react-stripe-checkout";
import Navbar from "../components/Navbar";
import AmountBtn from "../components/AmountBtn";
import logo from "../assets/altru.png";
import { api } from "../utils/axios";
import "./Ngo.css";

const Ngo = () => {
  const navigate = useNavigate();
  const { mongoUser, user, verifyUser } = useContext(AuthContext);
  const { id } = useParams();
  const [ngo, setNgo] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [clickedBtn, setClickedBtn] = useState("0");
  const notify = () => toast.success("Thank you for donating!");
  const amounts = [10, 15, 25, 50, 75];
  let total = 0;

  const fetchNgo = async () => {
    const token = await user.getIdToken();
    const res = await api.get(`/ngo/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNgo(res.data);
  };

  const handleFollow = async () => {
    try {
      const token = await user.getIdToken();
      console.log("Following ngo", ngo, ngo.name);
      await api.post(
        `/ngo/follow/${ngo._id}`,
        {
          ngoId: `${ngo._id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDisabled(true);
      await verifyUser(user);
    } catch (e) {
      console.log(e);
    }
  };

  const unfollowNgo = async (ngo) => {
    try {
      const token = await user.getIdToken();
      await api.put(`/ngo/unfollow/${ngo._id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await verifyUser(user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmation = async () => {
    try {
      const token = await user.getIdToken();
      console.log(
        "Publishable Key:",
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
      );
      await api.post(
        `/user/${user.uid}/donation`,
        {
          ngoId: `${ngo._id}`,
          amount: `${clickedBtn}`,
          ngoName: `${ngo.name}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await verifyUser(user);
      toast("Thank you for your donation!");
    } catch (e) {
      console.log(e);
    }
  };

  const handlePayment = async () => {
    handleConfirmation();
    const token = await user.getIdToken();
    const body = {
      token,
      total,
    };

    await api.post("/payment", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    fetchNgo();
  }, []);

  return (
    <div>
      <Navbar />
      <Toaster
        toastOptions={{
          style: { backgroundColor: "#00d26a", color: "white" },
        }}
      />
      <div>
        <div className="about-section">
          <div className="row">
            <h2>{ngo.name}</h2>
            <div className="donation-card">
              <p>Select an amount to donate: </p>

              <div className="donation-options">
                {amounts.map((amount, idx) => {
                  return (
                    <AmountBtn
                      key={idx}
                      amount={amount}
                      clickedBtn={clickedBtn}
                      setClickedBtn={setClickedBtn}
                    />
                  );
                })}
                <StripeCheckout
                  className="stripe-btn"
                  stripeKey="pk_test_51L1kSgAoNhpouPlcKhLQKANoLZIUKTvg6C2sNBHmBUlpAjYAD5SyZ4sKgTxSB3De9wi0hLyAMAaok6rMEcGqaEhH00Ukq7JyfZ"
                  image={logo}
                  token={handlePayment}
                  name="Making a donation"
                  amount={total * 100}
                />
              </div>
            </div>
          </div>

          <button
            disabled={disabled}
            className="follow-ngo-btn"
            onClick={handleFollow}
          >
            {mongoUser?.ngos &&
            mongoUser.ngos.find((item) => item === ngo._id) ? (
              <button
                className="unfollow-btn"
                // Pass in ngo to unfollow later ...
                onClick={async () => await unfollowNgo(ngo)}
              >
                Unfollow
              </button>
            ) : (
              `Follow ${ngo.name}`
            )}
          </button>

          <div className="background-image">NGO's background image</div>
          <p>Description: {ngo.description}</p>
          <div className="info">
            <p>
              <span>Location:{ngo.location}</span>
              Toronto
            </p>
            <p>
              <span>Tel: {ngo.telephone}</span>
            </p>

            <p>
              <span>Cause: {ngo.category}</span>
            </p>
            <p>
              <span>URL: {ngo.url}</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2>Volunteer Events</h2>
        <div className="ngo-row">
          {ngo && ngo.events && (
            <div className="ngo-events">
              {ngo.events.map((event, idx) => (
                <div key={idx} className="ngo-event-card">
                  <p>⭐ {event.name}</p>
                  <p>📍 {event.location}</p>
                  <p>📅 {event.date}</p>
                  <div className="button-row">
                    <button
                      className="details"
                      onClick={() => {
                        navigate(`/event/${event._id}`);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ngo;
