import React, { useState, useRef } from "react";
import ProfileDetails from "./ProfileDetails"; // Zaimportuj ProfileDetails
import ProfileArticles from "./ProfileArticles"; // Zaimportuj ProfileArticles
import styles from "./Profile.module.css";
import { CSSTransition } from "react-transition-group";
import { FaSignOutAlt } from "react-icons/fa";
import { Form } from "react-router-dom";

const animationTiming = {
  enter: 800,
  exit: 900,
};

const Profile = ({ user, onExit }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const profileDetailsRef = useRef(null); // Utwórz referencję
  const profileArticlesRef = useRef(null);

  if (!user || !user.data) return <div>Loading...</div>;

  const changeDisplayedItem = (state) => {
    if (selectedMenuItem === state) {
      setSelectedMenuItem(null);
    } else {
      setSelectedMenuItem(state);
    }
  };

  const menuClickHandler = (e) => {
    if (
      e.target.innerText === "Profile details" &&
      selectedMenuItem === "ProfileDetails"
    ) {
      setSelectedMenuItem(null);
    }

    switch (e.target.innerText) {
      case "Profile details":
        changeDisplayedItem("ProfileDetails");
        break;
      case "My articles":
        changeDisplayedItem("ProfileArticles");
        break;
      default:
        break;
    }
  };

  return (
    <ul className={styles.menu}>
      <li className={styles.menuItem} onClick={menuClickHandler}>
        Profile details
      </li>

      <CSSTransition
        nodeRef={profileDetailsRef} // Dodaj nodeRef
        in={selectedMenuItem === "ProfileDetails"}
        mountOnEnter
        unmountOnExit
        timeout={animationTiming}
        classNames={{
          enter: "",
          enterActive: styles.MenuOpen,
          exit: "",
          exitActive: styles.MenuClosed,
        }}
      >
        <div className={styles.newContent} ref={profileDetailsRef}>
          <ProfileDetails user={user.data} />
        </div>
      </CSSTransition>

      <li className={styles.menuItem} onClick={menuClickHandler}>
        My articles
      </li>

      <CSSTransition
        nodeRef={profileArticlesRef} // Dodaj nodeRef
        in={selectedMenuItem === "ProfileArticles"}
        mountOnEnter
        unmountOnExit
        timeout={animationTiming}
        classNames={{
          enter: "",
          enterActive: styles.MenuOpen,
          exit: "",
          exitActive: styles.MenuClosed,
        }}
      >
        <div ref={profileArticlesRef} className={styles.newContent}>
          <ProfileArticles {...user.data} />
        </div>
      </CSSTransition>

      <li className={styles.menuItem}>Achievements</li>
      <li className={styles.menuItem}>Settings</li>
      <Form className={styles.menuItem} action="/logout" method="post">
        <button onClick={onExit}>
          <div className={styles.icon}>
            <FaSignOutAlt />
          </div>
          Logout
        </button>
      </Form>
    </ul>
  );
};

export default Profile;
