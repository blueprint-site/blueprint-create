interface ErrorAlertProperties {
    heading: string,
    body: string,
}

import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function ErrorAlert({ heading, body }: ErrorAlertProperties) {
    const [show, setShow] = useState(true);

    if (show) {
        return (
            <Alert variant="danger absolute w-30" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{heading}</Alert.Heading>
                <p>
                    {body}
                </p>
            </Alert>
        );
    }

    return <></>
}

export default ErrorAlert;