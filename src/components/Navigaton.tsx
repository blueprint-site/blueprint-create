import { useTranslation } from "react-i18next";

import BlueprintLogo from '../assets/logo.webp';
import AddonIcon from '../assets/minecart_coupling.webp';
import SchematicIcon from '../assets/schematic.webp';
import AboutIcon from '../assets/clipboard.webp'
import Goggles from '../assets/goggles.webp'
import Blog from "../assets/blueprint-blog.png";

import NavigationLink from './NavigationLink';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


import '../styles/navigation.scss';
import LazyImage from "./LazyImage";
import { useEffect, useRef, useState } from "react";
import supabase from "./Supabase";

var client = supabase;

const Navigation = () => {
    const { t } = useTranslation();
    const [userdata, setUserdata] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userIcon, setUserIcon] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [linkDestination, setLinkDestination] = useState<string | null>(null);

    const location = useLocation();

    useEffect(() => {
        getUserData();
        setUserIcon(userdata?.user_metadata?.avatar_url ?? null);
        setUserName(userdata?.user_metadata?.custom_claims?.global_name ?? null);
        if (userdata) {
            setLinkDestination('/user');
        }
        else {
            setLinkDestination('/login');
        }
    }, [location]);


    const getUserData = async () => {
        const { data: { user } } = await client.auth.getUser()
        setUserdata(user) // Store the user data in the state
    }

    return (
        <>
            <nav>
                <NavLink className="logo" to="/"><LazyImage src={BlueprintLogo} alt="Logo" /><span>Blueprint</span></NavLink>
                <span />
                <NavigationLink destination={'/addons'} icon={AddonIcon} label={t("navigation.label.addons")}></NavigationLink>
                <NavigationLink destination={'/schematics'} icon={SchematicIcon} label={t("navigation.label.schematics")}></NavigationLink>
                <NavigationLink destination={'https://blueprint-site.github.io/blueprint-blog/'} icon={Blog} label={t("navigation.label.blog")}></NavigationLink>
                <NavigationLink destination={'/about'} icon={AboutIcon} label={t("navigation.label.about")}></NavigationLink>
                <NavigationLink destination={linkDestination ?? '/login'} icon={userIcon ?? Goggles} label={userName ?? t("navigation.label.login")}></NavigationLink>
            </nav>
        </>
    );
}

export default Navigation;