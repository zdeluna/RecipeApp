import React, { useContext } from "react";
import { Button } from "reactstrap";
import "./LogoutButton.css";

import { AuthContext } from "../AuthProvider";

const LogoutButton = props => {
    const { logout } = useContext(AuthContext);

    const handleLogOut = () => {
        logout();
    };

    return (
        <Button
            id={"logoutButton"}
            style={{ color: "#007BFF", fontSize: 20 }}
            color="none"
            size="sm"
            onClick={handleLogOut}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
