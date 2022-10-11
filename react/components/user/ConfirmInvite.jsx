import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import debug from 'sabio-debug';
import Swal from 'sweetalert2';
import '../user/user.css';
import emailLogo from '../../assets/images/email-logo.png';
import orgInviteServices from '../../services/orgInviteService';

const _logger = debug.extend('ConfirmInvite');

function ConfirmInvite() {
    const findToken = useLocation().search;

    const token = new URLSearchParams(findToken).get('token');
    _logger('search', findToken);
    _logger('token', token);

    const [isConfirmed, setIsConfirmed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        orgInviteServices.searchInvites(token).then(onConfirmSuccess).catch(onConfirmError);
    }, [token]);

    const onConfirmSuccess = (response) => {
        _logger(response.item);
        var matchToken = response.item.token;
        if (token === matchToken) {
            setIsConfirmed(!isConfirmed);
        }
        const state = { info: response.item, type: 'CONFIRMED_INVITE' };
        Swal.fire({
            title: 'Confirmed!',
            text: 'Click to redirect to signup and finish building your account.',
            icon: 'success',
            button: 'close',
        }).then(() => navigate('/register', { state }));
    };

    const onConfirmError = (err) => {
        _logger('confirm err ->', err);

        Swal.fire({
            title: 'There was a problem with confirmation',
            icon: 'error',
            button: 'close',
        });
    };

    return (
        <React.Fragment>
            <div className="token-confirm-bg">
                <div className="container">
                    <div className="token-confirm-message">
                        <img src={emailLogo} alt="email logo" className="token-confirm-logo" />
                        {isConfirmed ? (
                            <div>
                                <h3>Token</h3>
                                <p>Thanks for confirming your account!</p>
                            </div>
                        ) : (
                            <div>
                                <h3>Please check your email for a invite Link!</h3>
                                <p>
                                    An email has been sent to your inbox. Please click on the link provided within the
                                    email to confirm your account.
                                </p>
                                <Button className="btn" disabled>
                                    Waiting For Confirmation...
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ConfirmInvite;
