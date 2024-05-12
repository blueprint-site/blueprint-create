interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    contributions: number;
}

import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

import '../styles/contributors.scss';
import { useTranslation } from "react-i18next";
import LazyLoad from "react-lazyload";

function Contributors() {
    const [frontendContributors, setFrontendContributors] = useState<GitHubUser[]>([]);
    const [apiContributors, setApiContributors] = useState<GitHubUser[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            async function getContributors(repo: string) {
                const request = await fetch(`https://api.github.com/repos/blueprint-site/${repo}/contributors?per_page=50`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const contributorsList = await request.json();
                return contributorsList;
            }

            setFrontendContributors(await getContributors("blueprint-site.github.io"));
            setApiContributors(await getContributors("blueprint-api"));
        })();
    }, []);

    return (
        <>
            <div className="contributor-container">
                <h3 className="big-text">{t("home.contributions.title")}</h3>
                <span className="smol-text">{t("home.contributions.subtitle.main")}</span>
                <div className="contributors">
                    <LazyLoad offset={150}>
                        {frontendContributors.map((user) => {
                            return user.login == "blueprint-site" ? (<></>) : (
                                <Card style={{ width: '100%', backgroundColor: '#B3CAE5' }}>
                                    <Card.Img variant="top" src={`https://avatars.githubusercontent.com/u/${user.id}?size=96`} />
                                    <Card.Body>
                                        <Card.Title className="card-username">{user.login}</Card.Title>
                                        <span>
                                            {user.contributions}{" contributions"}
                                        </span>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </LazyLoad>
                </div>
                <span className="smol-text">{t("home.contributions.subtitle.api")}</span>
                <div className="contributors">
                    <LazyLoad offset={150}>
                        {apiContributors.map((user) => {
                            return user.login == "blueprint-site" ? (<></>) : (
                                <Card style={{ width: '100%', backgroundColor: '#B3CAE5' }}>
                                    <Card.Img variant="top" src={`https://avatars.githubusercontent.com/u/${user.id}?size=96`} />
                                    <Card.Body>
                                        <Card.Title className="card-username">{user.login}</Card.Title>
                                        <span>
                                            {user.contributions}{" contributions"}
                                        </span>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </LazyLoad>
                </div>
            </div>
        </>
    );
}

export default Contributors;