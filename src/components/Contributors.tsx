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

function Contributors() {
    const [contributors, setContributors] = useState<GitHubUser[]>([]);

    useEffect(() => {
        (async () => {
            async function getContributors() {
                const request = await fetch(`https://api.github.com/repos/blueprint-site/blueprint-site.github.io/contributors?per_page=50`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const contributorsList = await request.json();
                return contributorsList;
            }

            setContributors(await getContributors());
        })();
    }, []);

    return (
        <>
            <div className="contributor-container">
                <h3>Contributors</h3>
                <span>Thanks to our awesome contributors. Without you this wouldn't have been possible ❤️</span>
                <div className="contributors">
                    {contributors.map((user) => {
                        return (
                            <Card style={{ width: '100%' }}>
                                <Card.Img variant="top" src={user.avatar_url} />
                                <Card.Body>
                                    <Card.Title>{user.login}</Card.Title>
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