interface ErrorAlertProperties {
    heading: string,
    body: string,
}

import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import '@/styles/alert.scss';

function ErrorAlert({ heading, body }: ErrorAlertProperties) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        window.setTimeout(() => { setShow(false) }, 5000);
    }, []);

    if (show) {
        return (
            <Alert variant="danger" className='alert-absolute' onClose={() => setShow(false)} dismissible>
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