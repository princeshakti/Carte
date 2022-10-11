import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import debug from 'sabio-debug';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import emailLogo from '../../assets/images/email-logo.png';
import '../user/user.css';

const _logger = debug.extend('Confirm');

function Confirm() {
    const search = useLocation().search;
    _logger('search', search);
    const token = new URLSearchParams(search).get('token');
    _logger('token', token);

    const [isConfirmed, setIsConfirmed] = useState(false);

    const nav = useNavigate();

    useEffect(() => {
        if (token !== null) {
            userService.emailConfirm(token).then(onConfirmSuccess).catch(onConfirmError);
        }
    }, [token]);

    const onConfirmError = (err) => {
        _logger('confirm err ->', err);

        Swal.fire({
            title: 'Email Not Confirmed',
            icon: 'error',
            button: 'close',
        });
    };

    const onConfirmSuccess = (response) => {
        setIsConfirmed(!isConfirmed);
        _logger('confirm success ->', response);

        Swal.fire({
            title: 'Email Confirmed',
            text: 'Thanks for confirming you account!',
            icon: 'success',
            button: 'close',
        });
    };

    const onBtnClicked = (e) => {
        e.preventDefault();
        nav('/login');
    };
    return (
        <React.Fragment>
            <div className="email-confirm-background">
                <div className="container">
                    <div className="confirm-email-msg">
                        <img src={emailLogo} alt="email logo" className="email-confirm-logo" />
                        {isConfirmed ? (
                            <div>
                                <h3>Email Confirmed!</h3>
                                <p>Thanks for confirming your account! Click the button below to login.</p>
                                <Button className="user-btn" onClick={onBtnClicked}>
                                    Back to Login
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <h3>Please Check Your Email</h3>
                                <p>
                                    An email has been sent to your inbox. Please click on the link provided within the
                                    email to confirm your account.
                                </p>
                                <Button className="user-btn" disabled>
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

export default Confirm;
