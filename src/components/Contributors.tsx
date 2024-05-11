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

function Contributors() {
    const { t } = useTranslation();

    const [frontendContributors, setFrontendContributors] = useState<GitHubUser[]>([]);
    const [apiContributors, setApiContributors] = useState<GitHubUser[]>([]);

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
                <h3>{t("home.contributions.title")}</h3>
                <span>{t("home.contributions.subtitle.main")}</span>
                <div className="contributors">
                    {frontendContributors.map((user) => {
                        return user.login == "blueprint-site" ? (<></>) : (
                            <Card style={{ width: '100%' }}>
                                <Card.Img variant="top" src={user.avatar_url} />
                                <Card.Body>
                                    <Card.Title><a href={`https://github.com/${user.login}`} target="_blank">{user.login}</a></Card.Title>
                                    <span>
                                        {user.contributions}{" contributions"}
                                    </span>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
                <span>{t("home.contributions.subtitle.api")}</span>
                <div className="contributors">
                    {apiContributors.map((user) => {
                        return user.login == "blueprint-site" ? (<></>) : (
                            <Card style={{ width: '100%' }}>
                                <Card.Img variant="top" src={user.avatar_url} />
                                <Card.Body>
                                    <Card.Title><a href={`https://github.com/${user.login}`} target="_blank">{user.login}</a></Card.Title>
                                    <span>
                                        {user.contributions}{" contributions"}
                                    </span>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>

        </>
    );
}

export default Contributors;