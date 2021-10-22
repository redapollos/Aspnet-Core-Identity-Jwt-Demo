import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

const SiteMenu = () => {

    return (<Menu inlineIndent={12} mode="inline">
               <Menu.Item>
                    <NavLink to="/home">
                        <span>Home</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to="/dashboard">
                        <span>Dashboard</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
    )
}

export default SiteMenu;